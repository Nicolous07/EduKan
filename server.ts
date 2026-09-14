import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Lazy initialize GoogleGenAI client to avoid crash on startup if key is pending
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // -------------------------------------------------------------
  // Health check endpoint
  // -------------------------------------------------------------
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'EduKan Tanzania Backend Proxy',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // -------------------------------------------------------------
  // POST /api/ai/essay - Generate scholarship Statement of Purpose
  // -------------------------------------------------------------
  app.post('/api/ai/essay', async (req: Request, res: Response) => {
    try {
      const {
        scholarshipName,
        scholarshipProvider,
        applicantLevel,
        fieldOfStudy,
        careerAspiration,
        keyAchievements,
        financialNeedStory,
        tone = 'passionate',
        studentName = 'Mwanafunzi wa EduKan',
        studentSchool = 'Shule ya Sekondari Tanzania'
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        // High-quality contextual fallback if GEMINI_API_KEY is not configured yet
        const toneDesc =
          tone === 'passionate'
            ? 'Nia yangu thabiti inasukumwa na maono makubwa ya kuleta mabadiliko chanya ya kiuchumi na kijamii nchini Tanzania.'
            : tone === 'academic'
            ? 'Kupitia misingi imara ya nadharia na uwezo wa utafiti wa kisayansi niliouonyesha katika masomo yangu...'
            : 'Kwa unyenyekevu mkubwa na kutambua fursa ya pekee inayotolewa, ninaomba nafasi hii ya kuwa sehemu ya mabalozi wa elimu...';

        const fallbackEssay = `BARUA YA NIA NA MAOMBI YA UFADHILI WA MASOMO (STATEMENT OF PURPOSE)
KWA: KAMATI YA UFADHILI WA MASOMO YA ${(scholarshipName || 'UFADHILI WA ELIMU YA JUU').toUpperCase()}
KUTOKA KWA: ${(studentName || 'MWANAFUNZI WA TANZANIA').toUpperCase()}
TAASISI: ${(studentSchool || 'SHULE YA SEKONDARI TANZANIA').toUpperCase()}
FANI YA MASOMO: ${(fieldOfStudy || 'SAYANSI NA TEKNOLOJIA').toUpperCase()}

Heshima kwenu Waheshimiwa Wajumbe wa Kamati ya Ufadhili,

Ninaandika barua hii kwa heshima kubwa kuwasilisha maombi yangu rasmi ya ufadhili wa masomo chini ya mpango wa ${scholarshipName || 'Ufadhili wa Masomo'}. Safari yangu ya kitaaluma katika ngazi ya ${applicantLevel || 'Kidato cha Sita'} imekuwa kielelezo cha bidii, nidhamu, na shauku isiyotikisika kuelekea taaluma ya ${fieldOfStudy}. ${toneDesc}

Katika kipindi changu chote cha masomo, nimejitahidi kudumisha viwango vya juu vya ufaulu wa kitaaluma pamoja na uwajibikaji kwa jamii. ${keyAchievements || 'Nimekuwa nikifanya bidii darasani na kushiriki katika shughuli za klabu za kitaaluma.'} Mafanikio haya siyo tu alama za darasani, bali ni ushahidi wa utayari wangu wa kupambana na changamoto ngumu za kitaaluma na kuzigeuza kuwa fursa za uvumbuzi.

Hata hivyo, safari yangu inakabiliwa na kikwazo kikuu cha kifedha. ${financialNeedStory || 'Kutokana na hali ya kiuchumi ya familia yangu, ufadhili huu ni daraja muhimu litakalonisaidia kuendelea na masomo bila kukatishiwa ndoto zangu.'} Ufadhili huu wa ${scholarshipProvider || 'Wafadhili'} utanipa utulivu wa kisaikolojia, vifaa vya kisasa kama laptop na machapisho ya kitaaluma, na kuniwezesha kuelekeza nguvu zangu zote 100% katika kutafiti na kufanya vizuri zaidi.

Malengo yangu ya baadaye ni wazi: ${careerAspiration || 'Kutumia elimu na ujuzi nitakaoupata kuchangia maendeleo ya taifa letu la Tanzania.'} Ninaamini kuwa taifa letu linahitaji wataalamu wazalendo wenye ujuzi wa kiwango cha kimataifa. Ninaahidi kuwa mwanafunzi mfano wa kuigwa na kurudisha fadhila hizi kwa nchi yangu kwa uaminifu mkuu.

Ninawashukuru kwa moyo mkunjufu kwa muda wenu wa kupitia maombi yangu, na ninatumai kupokea fursa ya kutimiza ndoto hii chini ya mwamvuli wenu mtukufu.

Wenu mwaminifu katika ujenzi wa taifa,
${studentName}
Taasisi: ${studentSchool}
EduKan Verified Profile`;

        return res.json({
          essay: fallbackEssay,
          source: 'template_fallback',
          message: 'Generated using EduKan academic template (configure GEMINI_API_KEY for live deep reasoning)'
        });
      }

      const prompt = `Wewe ni Mshauri Mwandamizi wa Kitaaluma wa EduKan Tanzania (Senior Academic & Scholarship Advisor).
Andika barua kamili na ya kiwango cha juu sana ya maombi ya ufadhili wa masomo (Statement of Purpose / Motivation Letter) kwa Kiswahili fasaha chenye lugha ya staha, ufasaha, na ushawishi mkubwa.

MAELEZO YA MAOMBI:
- Mfadhili / Programu: ${scholarshipName} (${scholarshipProvider})
- Ngazi ya Mwombaji: ${applicantLevel}
- Fani ya Masomo: ${fieldOfStudy}
- Jina la Mwombaji: ${studentName}
- Shule / Taasisi: ${studentSchool}
- Malengo ya Kazi na Maono ya Baadaye: ${careerAspiration}
- Mafanikio Makuu ya Kitaaluma na Uongozi: ${keyAchievements}
- Hali ya Uhitaji wa Kifedha: ${financialNeedStory}
- Mtindo wa Uandishi (Tone): ${tone} (passionate / academic / humble)

MIONGOZO YA UANDISHI:
1. Iwe na anwani rasmi na kichwa cha habari kinachoeleweka vizuri.
2. Ionyeshe shauku ya kweli, ufaulu, na uzalendo kwa Tanzania.
3. Ifafanue jinsi ufadhili utakavyovunja vikwazo vya kifedha na kumwezesha mwombaji kufanya uvumbuzi.
4. Iunganishe maono ya kitaaluma na Mipango ya Maendeleo ya Taifa ya Tanzania (Dira ya Maendeleo 2050 / dira ya elimu na teknolojia).
5. Hitimisho liwe la heshima na shukrani, likiwa na jina na saini ya mwombaji.

Tafadhali andika barua hiyo kamili sasa:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are EduKan AI, the premier academic counseling assistant tailored for Tanzanian students from O-Level, A-Level to Universities. Output eloquent, professional and highly persuasive Kiswahili text suitable for official scholarship committees such as MoEST Samia Scholarship, HESLB, MasterCard Foundation, Chevening, and DAAD.'
        }
      });

      const essayText = response.text || '';
      return res.json({
        essay: essayText,
        source: 'gemini_api'
      });
    } catch (err: any) {
      console.error('Error generating scholarship essay:', err);
      return res.status(500).json({
        error: 'Hitilafu wakati wa kutoa barua ya ufadhili kupitia AI',
        details: err?.message || String(err)
      });
    }
  });

  // -------------------------------------------------------------
  // POST /api/ai/chat - AI Academic Tutor / Study Counselor
  // -------------------------------------------------------------
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, history = [], context = {} } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Smart localized fallback response
        const fallbackAnswers: Record<string, string> = {
          default: `Habari! Mimi ni Msaidizi wa Masomo wa EduKan Tanzania.
Kwa sasa mtandao wangu unafanya kazi kwenye hali ya maandalizi (offline/cached mode).
Niko hapa kukusaidia katika:
1. Kuchagua mchepuo wa Kidato cha V (PCB, PCM, HGL, CBG, EGM n.k.)
2. NECTA past papers na mbinu za kusoma kwa ufaulu wa Division One
3. Mwongozo wa mikopo ya HESLB na udahili wa vyuo vikuu (TCU).
Una swali gani mahususi kuhusu masomo yako?`
        };

        return res.json({
          reply: fallbackAnswers.default,
          source: 'offline_fallback'
        });
      }

      const systemPrompt = `Wewe ni EduKan AI Mwalimu Mkuu (Tanzania Premier Academic AI Tutor & Counselor).
Wasaidie wanafunzi wa Tanzania (O-Level, A-Level, Vyuo Vikuu na Vyuo vya Kati) katika:
- Kuelewa masomo ya sayansi, hisabati, lugha, biashara na sanaa.
- Maandalizi ya mitihani ya NECTA (FTNA, CSEE, ACSEE) na mitihani ya vyuo.
- Miongozo ya kozi za kipaumbele, vigezo vya TCU na mikopo ya HESLB.
Jibu kwa lugha safi ya Kiswahili, kirafiki, kwa mifano halisi ya mtaala wa Tanzania (TIE & NECTA), na ukijibu moja kwa moja swali la mwanafunzi.`;

      const prompt = `Historia ya Mazungumzo:
${Array.isArray(history) ? history.map((h: any) => `${h.sender === 'user' ? 'Mwanafunzi' : 'Mwalimu'}: ${h.text}`).join('\n') : ''}

Mwanafunzi anasema: ${message}

Jibu la Mwalimu wa EduKan:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt
        }
      });

      return res.json({
        reply: response.text || 'Samahani, jaribu kuuliza tena swali lako.',
        source: 'gemini_api'
      });
    } catch (err: any) {
      console.error('Error in AI chat proxy:', err);
      return res.status(500).json({
        error: 'Hitilafu kwenye soga ya AI',
        details: err?.message || String(err)
      });
    }
  });

  // -------------------------------------------------------------
  // POST /api/ai/explain-question - Homework & Exam Questions Solver
  // -------------------------------------------------------------
  app.post('/api/ai/explain-question', async (req: Request, res: Response) => {
    try {
      const { title, content, subject, topic } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          explanation: `Ufafanuzi wa Swali (${subject} - ${topic}):\n\nIli kujibu swali hili kwa ufasaha kulingana na muongozo wa Baraza la Mitihani la Tanzania (NECTA):\n1. Bainisha kanuni au nadharia kuu inayohusika.\n2. Weka wazi hatua kwa hatua jinsi ya kuanza na kufikia hitimisho sahihi.\n3. Andika hitimisho lililo wazi lenye vipimo au hoja thabiti.`,
          source: 'offline_fallback'
        });
      }

      const prompt = `Mwanafunzi wa EduKan Tanzania ameuliza swali lifuatalo:
Somo: ${subject || 'Masomo ya Jumla'}
Mada: ${topic || 'Mada ya Masomo'}
Kichwa cha Habari: ${title}
Maudhui ya Swali: ${content}

Tafadhali toa jibu kamili, lenye hatua kwa hatua kulingana na viwango vya NECTA / mtaala wa Tanzania. Toa mifano na mbinu rahisi ya kukumbuka kanuni husika.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are EduKan NECTA and University Exam Solver. Provide accurate, pedagogically sound, step-by-step explanations in clear Swahili.'
        }
      });

      return res.json({
        explanation: response.text || '',
        source: 'gemini_api'
      });
    } catch (err: any) {
      console.error('Error explaining question:', err);
      return res.status(500).json({
        error: 'Hitilafu wakati wa kutatua swali',
        details: err?.message || String(err)
      });
    }
  });

  // -------------------------------------------------------------
  // Vite Integration for Dev / Static Serving for Production
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduKan Tanzania Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
