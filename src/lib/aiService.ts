/**
 * EduKan AI Client Service
 * Calls server-side Express proxy endpoints (/api/ai/*)
 * Keeping Gemini API key securely hidden on the Node.js backend.
 */

export interface EssayGenerationParams {
  scholarshipName: string;
  scholarshipProvider: string;
  applicantLevel: string;
  fieldOfStudy: string;
  careerAspiration: string;
  keyAchievements: string;
  financialNeedStory: string;
  tone?: 'passionate' | 'academic' | 'humble';
  studentName?: string;
  studentSchool?: string;
}

export interface EssayGenerationResult {
  essay: string;
  source: 'gemini_api' | 'template_fallback' | 'offline_fallback';
  message?: string;
}

export interface ChatMessageParam {
  sender: 'user' | 'ambassador' | 'ai';
  text: string;
}

export const aiService = {
  /**
   * Generates a tailored Statement of Purpose / Scholarship Essay
   */
  async generateScholarshipEssay(params: EssayGenerationParams): Promise<EssayGenerationResult> {
    try {
      const response = await fetch('/api/ai/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      return {
        essay: data.essay,
        source: data.source || 'gemini_api',
        message: data.message
      };
    } catch (err) {
      console.warn('Backend proxy unreachable, falling back to smart local template:', err);
      return {
        essay: generateOfflineEssay(params),
        source: 'offline_fallback',
        message: 'Mtandao haupo au seva haipatikani kwa sasa. Imewekwa rasimu ya ndani ya EduKan.'
      };
    }
  },

  /**
   * AI Academic Tutor Chat
   */
  async chatWithTutor(message: string, history: ChatMessageParam[] = []): Promise<{ reply: string; source: string }> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();
      return {
        reply: data.reply,
        source: data.source || 'gemini_api'
      };
    } catch (err) {
      console.warn('AI Chat offline fallback:', err);
      return {
        reply: `Habari! Mfumo wa EduKan AI uko kwenye hali ya offline kwa sasa. 
Unaweza kuendelea kusoma vitabu vya TIE na past papers za NECTA zilizohifadhiwa kwenye simu yako bila intaneti.`,
        source: 'offline_fallback'
      };
    }
  },

  /**
   * Homework & Exam Question Solver
   */
  async explainQuestion(params: { title: string; content: string; subject: string; topic: string }): Promise<{ explanation: string; source: string }> {
    try {
      const response = await fetch('/api/ai/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();
      return {
        explanation: data.explanation,
        source: data.source || 'gemini_api'
      };
    } catch (err) {
      console.warn('Explain question fallback:', err);
      return {
        explanation: `Ufafanuzi wa Ndani wa EduKan (${params.subject} - ${params.topic}):\n\nIli kupata alama zote za NECTA kwa swali hili:\n1. Taja dhana na kanuni kuu (Law / Theory / Formula).\n2. Onyesha njia kamili ya hesabu au hoja zilizo na nambari.\n3. Hakikisha vitengo (SI Units) vimeandikwa kwa usahihi.`,
        source: 'offline_fallback'
      };
    }
  }
};

function generateOfflineEssay(params: EssayGenerationParams): string {
  const toneDesc =
    params.tone === 'passionate'
      ? 'Nia yangu thabiti inasukumwa na maono makubwa ya kuleta mabadiliko chanya ya kiuchumi na kijamii nchini Tanzania.'
      : params.tone === 'academic'
      ? 'Kupitia misingi imara ya nadharia na uwezo wa utafiti wa kisayansi niliouonyesha katika masomo yangu...'
      : 'Kwa unyenyekevu mkubwa na kutambua fursa ya pekee inayotolewa, ninaomba nafasi hii ya kuwa sehemu ya mabalozi wa elimu...';

  return `BARUA YA NIA NA MAOMBI YA UFADHILI WA MASOMO (STATEMENT OF PURPOSE)
KWA: KAMATI YA UFADHILI WA MASOMO YA ${(params.scholarshipName || 'UFADHILI WA ELIMU').toUpperCase()}
KUTOKA KWA: ${(params.studentName || 'MWANAFUNZI WA TANZANIA').toUpperCase()}
TAASISI: ${(params.studentSchool || 'SHULE YA SEKONDARI TANZANIA').toUpperCase()}
FANI: ${(params.fieldOfStudy || 'SAYANSI NA TEKNOLOJIA').toUpperCase()}

Heshima kwenu Waheshimiwa Wajumbe wa Bodi ya Ufadhili,

Ninaandika barua hii kwa heshima kubwa kuwasilisha maombi yangu rasmi ya ufadhili wa masomo chini ya mpango wa ${params.scholarshipName}. Safari yangu ya kitaaluma katika ngazi ya ${params.applicantLevel} imekuwa kielelezo cha bidii, nidhamu, na shauku isiyotikisika kuelekea taaluma ya ${params.fieldOfStudy}. ${toneDesc}

Katika kipindi changu chote cha masomo, nimejitahidi kudumisha viwango vya juu vya ufaulu wa kitaaluma pamoja na uwajibikaji kwa jamii. ${params.keyAchievements} Mafanikio haya siyo tu alama za darasani, bali ni ushahidi wa utayari wangu wa kupambana na changamoto ngumu za kitaaluma na kuzigeuza kuwa fursa za uvumbuzi.

Hata hivyo, safari yangu inakabiliwa na kikwazo kikuu cha kifedha. ${params.financialNeedStory} Ufadhili huu wa ${params.scholarshipProvider} utanipa utulivu wa kisaikolojia, vifaa vya kisasa kama laptop na machapisho ya kitaaluma, na kuniwezesha kuelekeza nguvu zangu zote 100% katika kutafiti na kufanya vizuri zaidi bila hofu ya kukatishiwa masomo kwa kukosa ada au mahitaji ya msingi.

Malengo yangu ya baadaye ni wazi: ${params.careerAspiration} Ninaamini kuwa taifa letu la Tanzania linahitaji wataalamu wazalendo wenye ujuzi wa kiwango cha kimataifa wanaoweza kutatua changamoto za viwanda, kilimo, na afya. Ninaahidi kuwa mwanafunzi mfano wa kuigwa na kurudisha fadhila hizi kwa nchi yangu kwa uaminifu mkuu.

Ninawashukuru kwa moyo mkunjufu kwa muda wenu wa kupitia maombi yangu, na ninatumai kupokea fursa ya kutimiza ndoto hii chini ya mwamvuli wenu mtukufu.

Wenu mwaminifu katika ujenzi wa taifa,
${params.studentName || 'Nicolous Munisi'}
Taasisi: ${params.studentSchool || 'Malampaka Secondary School'}
EduKan Verified Profile`;
}
