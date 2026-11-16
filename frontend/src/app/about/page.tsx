"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Cpu,
  HelpCircle,
  Scale,
  Sparkles,
  ArrowRight,
  Globe,
  Lock,
  Zap,
  Users,
  Database,
  Flame,
  FileText,
  HeartPulse,
  Award,
  Layers,
  KeyRound
} from "lucide-react";

type LanguageKey = "en" | "hi" | "ur" | "hinglish" | "pa";

interface SectionContent {
  section1_title: string;
  section1_text: string[];
  section2_title: string;
  section2_intro: string;
  section2_bullets: { title: string; desc: string }[];
  section3_title: string;
  section3_intro: string;
  section3_steps: { step: string; title: string; desc: string }[];
  section4_title: string;
  section4_problem_title: string;
  section4_problem_desc: string;
  section4_benefits_title: string;
  section4_benefits: { who: string; desc: string }[];
  section5_title: string;
  section5_intro: string;
  section5_comparisons: { system: string; drawback: string; securechain: string }[];
}

const CONTENT: Record<LanguageKey, SectionContent> = {
  // ==========================================
  // 1. ENGLISH
  // ==========================================
  en: {
    section1_title: "1. What is this project?",
    section1_text: [
      "SecureChain is a secure, patient-controlled digital locker for medical reports. It allows patients to upload sensitive medical scans and tests (such as MRI, CT, and cardiac reports) and lock them with mathematical rules so that only verified, authorized doctors can unlock and read them.",
      "Instead of storing medical records on vulnerable hospital servers, SecureChain uses advanced mathematical encryption (CP-ABE) and Ethereum blockchain technology so patients have total ownership, privacy, and sovereignty over their private health data."
    ],
    section2_title: "2. What does it do?",
    section2_intro: "Here are the main capabilities that patients, doctors, and hospitals can accomplish with SecureChain:",
    section2_bullets: [
      {
        title: "Patient-Controlled Access Rules",
        desc: "Patients choose exactly which doctors can see their reports based on department or medical role (e.g., 'Only Cardiology Specialists at City Hospital')."
      },
      {
        title: "Unhackable Decentralized Storage",
        desc: "Medical files are scrambled into unreadable mathematical code before leaving the patient's device and safely stored on a decentralized network (IPFS)."
      },
      {
        title: "Sub-Second Instant Revocation (<0.5s)",
        desc: "If a patient changes doctors or finishes treatment, they can cancel access with a single click in 0.34 seconds with zero file re-encryption."
      },
      {
        title: "Emergency Life-Saving Override (Break-Glass)",
        desc: "In critical trauma accidents where a patient is unconscious, ER doctors can unlock reports immediately while leaving a permanent, non-repudiable blockchain audit trail."
      },
      {
        title: "Tamper-Proof HIPAA Audit History",
        desc: "Every single time someone views, uploads, or cancels a record, it is permanently stamped onto Ethereum so nobody can secretly snoop on your records."
      }
    ],
    section3_title: "3. How does it work?",
    section3_intro: "A simple 5-step journey showing how a medical report moves safely from patient to doctor:",
    section3_steps: [
      {
        step: "Step 1",
        title: "Patient Uploads & Sets the Rule",
        desc: "The patient uploads their diagnostic PDF/scan and chooses an access rule (e.g., 'Must be a verified Cardiologist')."
      },
      {
        step: "Step 2",
        title: "Dual Mathematical Lock",
        desc: "The computer scrambles the file using military-grade AES-256 encryption and locks the key with the patient's custom rule using Attribute-Based Encryption."
      },
      {
        step: "Step 3",
        title: "Stored in a Decentralized Vault",
        desc: "The scrambled file is sent to decentralized IPFS storage. Nobody—not even the server host—can read the cleartext file."
      },
      {
        step: "Step 4",
        title: "Doctor Requests Access",
        desc: "When a doctor logs in, the system checks their certified medical credentials against the file's mathematical lock."
      },
      {
        step: "Step 5",
        title: "Instant Unlock or Strict Block",
        desc: "If the doctor's credentials match the rule, the file decrypts in 0.78 seconds. If not, access is strictly rejected in 0.12 seconds and an alert is logged."
      }
    ],
    section4_title: "4. Why do we need this?",
    section4_problem_title: "The Real-World Crisis in Healthcare IT",
    section4_problem_desc: "Over 133 million patient records were leaked or stolen in recent healthcare data breaches. In traditional hospitals, IT workers, database administrators, and cybercriminals can view sensitive cancer diagnoses, psychiatric notes, and HIV test results. Furthermore, patients have zero say over who sees their files once submitted.",
    section4_benefits_title: "Who Benefits from SecureChain?",
    section4_benefits: [
      {
        who: "For Patients",
        desc: "Total peace of mind and true ownership over their confidential health history with the power to grant or revoke doctor access anytime."
      },
      {
        who: "For Doctors",
        desc: "Instant, trusted cross-hospital access to patient diagnostic scans in 0.78 seconds without waiting days for faxes or administrative bureaucracy."
      },
      {
        who: "For Hospitals",
        desc: "100% immunity against ransomware extortion and data breach lawsuits, with automatic HIPAA §164.312 and GDPR compliance."
      }
    ],
    section5_title: "5. How is it different?",
    section5_intro: "Comparing SecureChain against traditional hospital databases and earlier blockchain research projects:",
    section5_comparisons: [
      {
        system: "Traditional Centralized EHR (Epic / Cerner / AWS)",
        drawback: "Records stored in cleartext on central databases; single hacked password leaks millions of records; zero patient consent control.",
        securechain: "Zero single point of failure; data is encrypted on the patient's device; patient has 100% mathematical ownership."
      },
      {
        system: "Earlier Blockchain Research (MedRec / MIT)",
        drawback: "Uses symmetric keys with coarse-grained all-or-nothing access; revoking access takes 2.0 seconds and stores audit logs in normal SQL databases.",
        securechain: "Fine-grained multi-attribute boolean rules (AND/OR); dynamic revocation in 0.34s; audit logs permanently anchored to Ethereum."
      },
      {
        system: "Standard Public Key Cryptography (RSA / ECC)",
        drawback: "If 50 doctors need access, you must encrypt 50 separate copies or manage 50 separate keys, making multi-doctor emergency care impossible.",
        securechain: "Encrypt ONCE under a policy formula; any current or future doctor with certified matching attributes can decrypt instantly."
      }
    ]
  },

  // ==========================================
  // 2. HINDI (हिंदी)
  // ==========================================
  hi: {
    section1_title: "1. यह प्रोजेक्ट क्या है?",
    section1_text: [
      "सिक्योरचेन (SecureChain) मेडिकल रिपोर्टों के लिए एक सुरक्षित, मरीज-नियंत्रित डिजिटल लॉकर है। यह मरीजों को अपनी संवेदनशील मेडिकल रिपोर्ट (जैसे एमआरआई स्कैन, सीटी स्कैन और दिल की जांच रिपोर्ट) अपलोड करने और उन्हें गणितीय नियमों से लॉक करने की सुविधा देता है ताकि केवल सत्यापित और अधिकृत डॉक्टर ही उन्हें खोल और पढ़ सकें।",
      "मरीजों के मेडिकल रिकॉर्ड को अस्पताल के असुरक्षित कंप्यूटरों पर रखने के बजाय, सिक्योरचेन आधुनिक गणितीय एन्क्रिप्शन (CP-ABE) और एथेरियम ब्लॉकचेन तकनीक का उपयोग करता है, जिससे मरीजों को अपने स्वास्थ्य डेटा पर पूर्ण स्वामित्व, गोपनीयता और अधिकार मिलता है।"
    ],
    section2_title: "2. यह क्या करता है?",
    section2_intro: "मरीज, डॉक्टर और अस्पताल सिक्योरचेन की मदद से ये मुख्य कार्य आसानी से कर सकते हैं:",
    section2_bullets: [
      {
        title: "मरीज का पूर्ण नियंत्रण",
        desc: "मरीज खुद तय करते हैं कि कौन सा डॉक्टर उनकी रिपोर्ट देख सकता है (जैसे: 'केवल कार्डियोलॉजी विभाग के प्रमाणित डॉक्टर')।"
      },
      {
        title: "अभेद्य और सुरक्षित स्टोरेज (IPFS)",
        desc: "मेडिकल फाइलें मरीज के फोन/कंप्यूटर से निकलने से पहले ही कूट रूप (एन्क्रिप्ट) में बदल जाती हैं, जिससे कोई हैकर या सर्वर ऑपरेटर उन्हें चुरा या पढ़ नहीं सकता।"
      },
      {
        title: "एक क्लिक में तुरंत अनुमति रद्द (0.34 सेकंड)",
        desc: "इलाज पूरा होने या डॉक्टर बदलने पर मरीज सिर्फ एक क्लिक में डॉक्टर की अनुमति तुरंत (0.34 सेकंड में) बिना फाइल दोबारा लॉक किए रद्द कर सकता है।"
      },
      {
        title: "आपातकालीन जीवन-रक्षक मोड (Break-Glass)",
        desc: "सड़क दुर्घटना या बेहੋਸ਼ੀ की स्थिति में इमरजेंसी डॉक्टर तुरंत फाइल खोल सकते हैं, लेकिन इसकी पूरी कानूनी जानकारी ब्लॉकचेन पर हमेशा के लिए दर्ज हो जाती है।"
      },
      {
        title: "छेड़छाड़-मुक्त HIPAA ऑडिट रिकॉर्ड",
        desc: "जब भी कोई रिपोर्ट देखता है या अनुमति बदलता है, उसकी जानकारी ब्लॉकचेन पर हमेशा के लिए सुरक्षित हो जाती है, जिससे कोई चोरी-छिपे आपकी रिपोर्ट नहीं देख सकता।"
      }
    ],
    section3_title: "3. यह कैसे काम करता है?",
    section3_intro: "5 आसान चरणों में समझें कि एक मेडिकल रिपोर्ट मरीज से डॉक्टर तक सुरक्षित कैसे पहुंचती है:",
    section3_steps: [
      {
        step: "चरण 1",
        title: "मरीज रिपोर्ट अपलोड करता है और नियम बनाता है",
        desc: "मरीज अपनी रिपोर्ट चुनता है और नियम तय करता है (जैसे: 'केवल दिल के डॉक्टर ही इसे खोल सकें')।"
      },
      {
        step: "चरण 2",
        title: "गणितीय दोहरा ताला लगना",
        desc: "कंप्यूटर फाइल को सैन्य-ग्रेड AES-256 एन्क्रिप्शन से लॉक करता है और उसकी चाबी को मरीज के नियम से बांध देता है।"
      },
      {
        step: "चरण 3",
        title: "सुरक्षित डीसेंट्रलाइज्ड वॉल्ट में जमा",
        desc: "लॉक की गई फाइल सुरक्षित आईपीएफएस (IPFS) नेटवर्क पर जमा होती है। सर्वर ऑपरेटर भी इसे नहीं पढ़ सकता।"
      },
      {
        step: "चरण 4",
        title: "डॉक्टर अनुमति मांगता है",
        desc: "जब डॉक्टर लॉग इन करता है, तो सिस्टम उसकी डिग्री और विभाग की जांच फाइल के ताले से करता है।"
      },
      {
        step: "चरण 5",
        title: "तुरंत खुलना या ब्लॉक होना",
        desc: "यदि डॉक्टर के पास सही योग्यता है, तो रिपोर्ट 0.78 सेकंड में खुल जाती है। गलत डॉक्टर की कोशिश 0.12 सेकंड में ब्लॉक हो जाती है और अलर्ट दर्ज होता है।"
      }
    ],
    section4_title: "4. हमें इसकी आवश्यकता क्यों है?",
    section4_problem_title: "स्वास्थ्य सेवा में डेटा चोरी का बड़ा संकट",
    section4_problem_desc: "हाल के वर्षों में 13 करोड़ से अधिक मेडिकल रिकॉर्ड अस्पतालों के डेटाबेस से चोरी हुए हैं। सामान्य अस्पतालों में आईटी कर्मचारी, क्लर्क या हैकर मरीज की बीमारी, कैंसर या मानसिक स्वास्थ्य रिपोर्ट देख सकते हैं। मरीज का अपनी ही रिपोर्ट पर कोई नियंत्रण नहीं रहता।",
    section4_benefits_title: "सिक्योरचेन से किसे लाभ होता है?",
    section4_benefits: [
      {
        who: "मरीजों के लिए",
        desc: "पूरी मानसिक शांति कि उनका मेडिकल रिकॉर्ड पूरी तरह निजी है और वे कभी भी डॉक्टर की अनुमति दे या हटा सकते हैं।"
      },
      {
        who: "डॉक्टरों के लिए",
        desc: "दूसरे अस्पतालों की रिपोर्ट देखने के लिए हफ्तों इंतजार नहीं करना पड़ता, 0.78 सेकंड में तुरंत सही इलाज शुरू होता है।"
      },
      {
        who: "अस्पतालों के लिए",
        desc: "डेटा चोरी और रैंसमवेयर ब्लैकमेल से 100% सुरक्षा, साथ ही HIPAA और GDPR नियमों का पूरा पालन।"
      }
    ],
    section5_title: "5. यह दूसरों से अलग कैसे है?",
    section5_intro: "पारंपरिक अस्पताल प्रणालियों और पुराने ब्लॉकचेन प्रोजेक्ट्स के साथ तुलना:",
    section5_comparisons: [
      {
        system: "पारंपरिक अस्पताल प्रणाली (Epic / Cerner / AWS)",
        drawback: "डेटा अस्पताल के केंद्रीय कंप्यूटर पर खुला रहता है; एक पासवर्ड हैक होने से लाखों मरीजों का डेटा चोरी हो जाता है।",
        securechain: "डेटा मरीज के पास से ही गणितीय रूप से लॉक होकर निकलता है; कोई केंद्रीय सर्वर नहीं है जिसे हैक किया जा सके।"
      },
      {
        system: "पुराने ब्लॉकचेन प्रोजेक्ट (MedRec / MIT)",
        drawback: "मरीज की अनुमति हटाने में 2.0 सेकंड लगते हैं और साधारण एसक्यूएल डेटाबेस में लॉग रखे जाते हैं।",
        securechain: "मल्टी-एट्रिब्यूट बूलियन नियम; अनुमति सिर्फ 0.34 सेकंड में रद्द; सारे ऑडिट लॉग ब्लॉकचेन पर हमेशा सुरक्षित।"
      },
      {
        system: "सामान्य पब्लिक-की क्रिप्टोग्राफी (RSA / ECC)",
        drawback: "अगर 50 डॉक्टरों को रिपोर्ट देनी हो, तो 50 अलग-अलग कॉपियां बनानी पड़ती हैं, जो इमरजेंसी में असंभव है।",
        securechain: "सिर्फ एक बार नियम के साथ लॉक करें; कोई भी योग्य डॉक्टर अपनी चाबी से तुरंत रिपोर्ट खोल सकता है।"
      }
    ]
  },

  // ==========================================
  // 3. URDU (اردو) - RTL
  // ==========================================
  ur: {
    section1_title: "1. یہ پروجیکٹ کیا ہے؟",
    section1_text: [
      "سیکیور چین (SecureChain) میڈیکل رپورٹس کے لیے ایک انتہائی محفوظ اور مریض کے مکمل کنٹرول میں ڈیجیٹل لاکر ہے۔ یہ مریضوں کو اپنی حساس میڈیکل رپورٹس (جیسے ایم آر آئی، سی ٹی اسکین اور دل کی رپورٹس) اپ لوڈ کرنے اور انہیں ریاضیاتی اصولوں سے لاک کرنے کی سہولت دیتا ہے تاکہ صرف تصدیق شدہ اور مجاز ڈاکٹر ہی انہیں کھول کر پڑھ سکیں۔",
      "ہسپتالوں کے غیر محفوظ کمپیوٹرز پر ریکارڈز چھوڑنے کے بجائے، سیکیور چین جدید ریاضیاتی انکرپشن (CP-ABE) اور ایتھیریم بلاک چین ٹیکنالوجی استعمال کرتا ہے تاکہ مریضوں کو اپنے ڈیٹا پر مکمل مالکانہ حق، رازداری اور خود مختاری حاصل رہے۔"
    ],
    section2_title: "2. یہ کیا کرتا ہے؟",
    section2_intro: "مریض، ڈاکٹر اور ہسپتال سیکیور چین کے ذریعے یہ اہم کام باآسانی انجام دے سکتے ہیں:",
    section2_bullets: [
      {
        title: "مریض کے مکمل کنٹرول میں رسائی کے اصول",
        desc: "مریض خود طے کرتا ہے کہ کون سا ڈاکٹر اس کی رپورٹ دیکھ سکتا ہے (مثلاً: 'صرف کارڈیالوجی کے تصدیق شدہ ڈاکٹرز')۔"
      },
      {
        title: "ہیک پروف غیر مرکزی اسٹوریج (IPFS)",
        desc: "فائلیں مریض کے ڈیوائس سے نکلنے سے پہلے ہی ناقابلِ فہم کوڈ میں تبدیل ہو کر ڈی سینٹرلائزڈ نیٹ ورک پر محفوظ ہو جاتی ہیں۔"
      },
      {
        title: "ایک کلک میں رسائی کی فوری منسوخی (0.34 سیکنڈ)",
        desc: "علاج مکمل ہونے پر مریض صرف ایک کلک سے 0.34 سیکنڈ کے اندر بغیر فائل دوبارہ لاک کیے ڈاکٹر کی رسائی منسوخ کر سکتا ہے۔"
      },
      {
        title: "ہنگامی جان بچانے والا بریک گلاس موڈ",
        desc: "ایمرجنسی یا بے ہوشی کی حالت میں ٹراما ڈاکٹرز فوری رپورٹ کھول سکتے ہیں، لیکن اس کا غیر مٹنے والا قانونی ریکارڈ بلاک چین پر درج ہو جاتا ہے۔"
      },
      {
        title: "ناقابلِ رد و بدل HIPAA آڈٹ ہسٹری",
        desc: "جب بھی کوئی رپورٹ دیکھتا ہے یا اجازت بدلتا ہے، اس کا باقاعدہ ثبوت ہمیشہ کے لیے بلاک چین پر محفوظ رہتا ہے تاکہ کوئی چوری چھپے ڈیٹا نہ دیکھ سکے۔"
      }
    ],
    section3_title: "3. یہ کیسے کام کرتا ہے؟",
    section3_intro: "5 آسان مراحل میں سمجھیں کہ ایک میڈیکل رپورٹ مریض سے ڈاکٹر تک محفوظ طریقے سے کیسے پہنچتی ہے:",
    section3_steps: [
      {
        step: "مرحلہ 1",
        title: "مریض رپورٹ اپ لوڈ کرتا ہے اور شرط لگاتا ہے",
        desc: "مریض اپنی رپورٹ منتخب کرتا ہے اور شرط لگاتا ہے (مثلاً: 'صرف دل کے ماہر ڈاکٹر ہی کھول سکیں')۔"
      },
      {
        step: "مرحلہ 2",
        title: "ریاضیاتی دہرا تالا لگنا",
        desc: "کمپیوٹر فائل کو ملٹری گریڈ انکرپشن سے محفوظ کرتا ہے اور چابی کو مریض کی شرط کے ساتھ مقفل کر دیتا ہے۔"
      },
      {
        step: "مرحلہ 3",
        title: "ڈی سینٹرلائزڈ والٹ میں محفوظگی",
        desc: "فائل محفوظ آئی پی ایف ایس (IPFS) نیٹ ورک پر چلی جاتی ہے، جسے سرور کا مالک بھی نہیں پڑھ سکتا۔"
      },
      {
        step: "مرحلہ 4",
        title: "ڈاکٹر کی تصدیق کی جانچ",
        desc: "ڈاکٹر لاگ ان ہوتا ہے تو سسٹم اس کی میڈیکل ڈگری اور شعبے کی خودکار تصدیق کرتا ہے۔"
      },
      {
        step: "مرحلہ 5",
        title: "فوری رسائی یا بلاک ہونا",
        desc: "اگر ڈاکٹر کی اہلیت شرط کے مطابق ہو تو رپورٹ 0.78 سیکنڈ میں کھل جاتی ہے، بصورت دیگر غیر متعلقہ ڈاکٹر کو فوراً بلاک کر دیا جاتا ہے۔"
      }
    ],
    section4_title: "4. ہمیں اس کی ضرورت کیوں ہے؟",
    section4_problem_title: "ہیلتھ کیئر میں ڈیٹا چوری کا بڑا بحران",
    section4_problem_desc: "حالیہ برسوں میں 13 کروڑ سے زائد مریضوں کا پرائیویٹ ریکارڈ ہسپتالوں کے ڈیٹا بیس ہیک ہونے سے چوری ہوا۔ روایتی ہسپتالوں میں آئی ٹی ملازمین، کلرک یا ہیکرز مریض کی بیماری، کینسر یا نفسیاتی رپورٹس دیکھ سکتے ہیں۔ مریض کا اپنی رپورٹ پر کوئی کنٹرول نہیں رہتا۔",
    section4_benefits_title: "سیکیور چین سے کسے فائدہ ہوتا ہے؟",
    section4_benefits: [
      {
        who: "مریضوں کے لیے",
        desc: "مکمل ذہنی سکون کہ ان کا میڈیکل ڈیٹا نجی ہے اور وہ جب چاہیں ڈاکٹر کی اجازت منسوخ کر سکتے ہیں۔"
      },
      {
        who: "ڈاکٹرز کے لیے",
        desc: "دوسرے ہسپتالوں کی رپورٹس کے لیے دنوں تک انتظار نہیں کرنا پڑتا، 0.78 سیکنڈ میں درست تشخیص اور علاج شروع ہوتا ہے۔"
      },
      {
        who: "ہسپتالوں کے لیے",
        desc: "ڈیٹا چوری اور تاوان کے حملوں (Ransomware) سے 100 فیصد نجات، اور بین الاقوامی قوانین کی مکمل پاسداری۔"
      }
    ],
    section5_title: "5. یہ دوسروں سے مختلف کیوں ہے؟",
    section5_intro: "روایتی ہسپتالوں اور پرانے بلاک چین پراجیکٹس کے مقابلے میں سیکیور چین کی برتری:",
    section5_comparisons: [
      {
        system: "روایتی ہسپتال کے ڈیٹا بیس (Epic / Cerner / AWS)",
        drawback: "ڈیٹا مرکزی سرورز پر صاف الفاظ میں محفوظ ہوتا ہے؛ ایک پاس ورڈ ہیک ہونے سے لاکھوں مریضوں کا ڈیٹا چوری ہو جاتا ہے۔",
        securechain: "ڈیٹا مریض کے ڈیوائس پر ہی انکرپٹ ہو کر نکلتا ہے؛ کوئی بھی مرکزی سرور نہیں ہے جس پر حملہ کیا جا سکے۔"
      },
      {
        system: "پرانے بلاک چین سسٹمز (MedRec / MIT)",
        drawback: "ڈاکٹر کی اجازت ہٹانے میں 2.0 سیکنڈ لگتے ہیں اور آڈٹ لاگز عام ایس کیو ایل ڈیٹا بیس میں رکھے جاتے ہیں۔",
        securechain: "پیچیدہ بولین شرائط؛ اجازت صرف 0.34 سیکنڈ میں منسوخ؛ تمام آڈٹ لاگز بلاک چین پر مستقل محفوظ۔"
      },
      {
        system: "عام پبلک کی کرپٹوگرافی (RSA / ECC)",
        drawback: "اگر 50 ڈاکٹرز کو رسائی دینی ہو تو 50 الگ کاپیاں بنانی پڑتی ہیں جو ایمرجنسی میں ناممکن ہے۔",
        securechain: "صرف ایک بار شرط لگا کر محفوظ کریں؛ کوئی بھی متعلقہ ڈاکٹر اپنی چابی سے فوری رپورٹ کھول سکتا ہے۔"
      }
    ]
  },

  // ==========================================
  // 4. HINGLISH (Hindi in Roman English)
  // ==========================================
  hinglish: {
    section1_title: "1. Yeh project kya hai?",
    section1_text: [
      "SecureChain medical reports ke liye ek ultra-secure, patient-controlled digital locker hai. Isme patient apni sensitive medical reports (jaise MRI scan, blood report, cardiac test) ko mathematically lock karke upload karta hai taaki sirf verified aur authorized doctor hi use khol aur dekh sakein.",
      "Hospital ke vulnerable central computer par records chhodne ke bajaye, SecureChain advanced mathematical encryption (CP-ABE) aur Ethereum blockchain use karta hai, jisse patient ko apne medical data par 100% ownership aur privacy milti hai."
    ],
    section2_title: "2. Yeh kya karta hai?",
    section2_intro: "Patients, doctors aur hospitals SecureChain ki madad se ye main kaam aasaani se kar sakte hain:",
    section2_bullets: [
      {
        title: "Patient Ka Full Control",
        desc: "Patient khud decide karta hai ki kaun sa doctor uski report dekhega (jaise: 'Sirf Cardiology Department ke verified doctor')."
      },
      {
        title: "Unhackable Storage (IPFS)",
        desc: "File patient ke computer/phone se nikalte hi encrypted code ban jaati hai, jise koi hacker ya cloud admin bina permission nahi khol sakta."
      },
      {
        title: "Single-Click Access Cancel (0.34s Revocation)",
        desc: "Treatment khatam hote hi patient bas 1 click me doctor ka access 0.34 second ke andar bina file dobara lock kiye cancel kar sakta hai."
      },
      {
        title: "Emergency Life-Saving Mode (Break-Glass)",
        desc: "Agar patient accident me behosh ho jaye, toh Emergency ER doctor turant file unlock kar sakta hai, lekin doctor ki details aur reason blockchain par hamesha ke liye record ho jati hai."
      },
      {
        title: "Tamper-Proof Audit History",
        desc: "Har access, view ya revocation ka permanent proof blockchain par save hota hai taaki koi chupke se aapka record na dekh sake."
      }
    ],
    section3_title: "3. Yeh kaam kaise karta hai?",
    section3_intro: "5 aasan steps me samjhein ki ek medical report patient se doctor tak safely kaise pahunchti hai:",
    section3_steps: [
      {
        step: "Step 1",
        title: "Patient Upload & Rule Set Karta Hai",
        desc: "Patient apni report choose karta hai aur rule lagata hai (jaise: 'Must be a verified Cardiologist')."
      },
      {
        step: "Step 2",
        title: "Dual Mathematical Lock",
        desc: "Computer file ko military-grade AES-256 se lock karta hai aur uski key ko patient ke rule se attach kar deta hai."
      },
      {
        step: "Step 3",
        title: "Decentralized Vault Me Storage",
        desc: "Encrypted file IPFS network par save ho jati hai. Storage provider bhi ise cleartext me nahi padh sakta."
      },
      {
        step: "Step 4",
        title: "Doctor Login & Identity Verification",
        desc: "Doctor jab open karne ki koshish karta hai, system uski medical degree aur department check karta hai."
      },
      {
        step: "Step 5",
        title: "Instant Unlock Ya Strict Block",
        desc: "Agar doctor ka department patient ke rule se match hota hai toh report 0.78 second me open ho jati hai, warna access mathematically block ho jata hai."
      }
    ],
    section4_title: "4. Humein iski zaroorat kyun hai?",
    section4_problem_title: "Healthcare Me Data Leak Ka Bada Sankat",
    section4_problem_desc: "Pichle kuch saalon me 13 Crore se zyada medical records hospital databases se hack ya leak ho chuke hain. Normal hospitals me IT staff, clerks ya hackers private bimariyon ki reports dekh sakte hain. Patient ka apni hi report par koi control nahi rehta.",
    section4_benefits_title: "Kisko Fayda Hota Hai?",
    section4_benefits: [
      {
        who: "Patients Ke Liye",
        desc: "Complete mental peace ki unka confidential health data bilkul safe hai aur wo kabhi bhi access de ya hata sakte hain."
      },
      {
        who: "Doctors Ke Liye",
        desc: "Dusre hospitals ki reports ke liye dino tak wait nahi karna padta, 0.78 second me instant access aur sahi treatment shuru hota hai."
      },
      {
        who: "Hospitals Ke Liye",
        desc: "Ransomware extortion aur privacy fines se 100% protection, saath hi HIPAA aur GDPR compliance."
      }
    ],
    section5_title: "5. Yeh doosron se different kaise hai?",
    section5_intro: "Traditional hospital databases aur purane blockchain systems se compare karein:",
    section5_comparisons: [
      {
        system: "Normal Hospital Systems (Epic / Cerner / AWS)",
        drawback: "Sabhi records central database par plain text me hote hain; ek password hack hone se sab kuch leak ho jata hai.",
        securechain: "Data patient ke device par hi mathematical formula se lock hota hai; koi central point nahi hai jise hack kiya ja sake."
      },
      {
        system: "Purane Blockchain Systems (MedRec / MIT)",
        drawback: "Doctor ka access hatane me 2.0 second lagte hain aur audit logs normal SQL tables me rakhe jaate hain.",
        securechain: "Expressive boolean rules; access sirf 0.34 second me cancel; saare audit logs Ethereum par permanently locked."
      },
      {
        system: "Standard Public Key Cryptography (RSA / ECC)",
        drawback: "Agar 50 doctors ko report deni ho, toh 50 alag-alag copies banani padti hain, jo emergency me impossible hai.",
        securechain: "Sirf ek baar rule ke saath lock karein; koi bhi qualified doctor apni key se report turant open kar sakta hai."
      }
    ]
  },

  // ==========================================
  // 5. PUNJABI (ਪੰਜਾਬੀ)
  // ==========================================
  pa: {
    section1_title: "1. ਇਹ ਪ੍ਰੋਜੈਕਟ ਕੀ ਹੈ?",
    section1_text: [
      "ਸਿਕਿਓਰਚੇਨ (SecureChain) ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ ਲਈ ਇੱਕ ਸੁਰੱਖਿਅਤ ਅਤੇ ਮਰੀਜ਼ ਦੇ ਕੰਟਰੋਲ ਵਾਲਾ ਡਿਜੀਟਲ ਲਾਕਰ ਹੈ। ਇਹ ਮਰੀਜ਼ਾਂ ਨੂੰ ਆਪਣੀਆਂ ਸੰਵੇਦਨਸ਼ੀਲ ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ (ਜਿਵੇਂ ਐਮ.ਆਰ.ਆਈ. ਸਕੈਨ, ਖੂਨ ਟੈਸਟ ਅਤੇ ਦਿਲ ਦੀਆਂ ਰਿਪੋਰਟਾਂ) ਅਪਲੋਡ ਕਰਨ ਅਤੇ ਉਹਨਾਂ ਨੂੰ ਗਣਿਤਿਕ ਨਿਯਮਾਂ ਨਾਲ ਲਾਕ ਕਰਨ ਦੀ ਸਹੂਲਤ ਦਿੰਦਾ ਹੈ ਤਾਂ ਜੋ ਸਿਰਫ਼ ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਅਧਿਕਾਰਤ ਡਾਕਟਰ ਹੀ ਉਹਨਾਂ ਨੂੰ ਖੋਲ੍ਹ ਸਕਣ।",
      "ਰਿਕਾਰਡਾਂ ਨੂੰ ਹਸਪਤਾਲ ਦੇ ਅਸੁਰੱਖਿਅਤ ਕੰਪਿਊਟਰਾਂ ਉੱਤੇ ਰੱਖਣ ਦੀ ਬਜਾਏ, ਸਿਕਿਓਰਚੇਨ ਆਧੁਨਿਕ ਗਣਿਤਿਕ ਐਨਕ੍ਰਿਪਸ਼ਨ (CP-ABE) ਅਤੇ ਬਲਾਕਚੈਨ ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਮਰੀਜ਼ਾਂ ਨੂੰ ਆਪਣੇ ਸਿਹਤ ਡੇਟਾ ਉੱਤੇ ਪੂਰੀ ਮਾਲਕੀ ਅਤੇ ਗੁਪਤਤਾ ਮਿਲੇ।"
    ],
    section2_title: "2. ਇਹ ਕੀ ਕਰਦਾ ਹੈ?",
    section2_intro: "ਮਰੀਜ਼, ਡਾਕਟਰ ਅਤੇ ਹਸਪਤਾਲ ਸਿਕਿਓਰਚੇਨ ਦੀ ਮਦਦ ਨਾਲ ਇਹ ਮੁੱਖ ਕੰਮ ਕਰ ਸਕਦੇ ਹਨ:",
    section2_bullets: [
      {
        title: "ਮਰੀਜ਼ ਦਾ ਪੂਰਾ ਕੰਟਰੋਲ",
        desc: "ਮਰੀਜ਼ ਆਪ ਚੁਣਦਾ ਹੈ ਕਿ ਕਿਹੜਾ ਡਾਕਟਰ ਉਸ ਦੀ ਰਿਪੋਰਟ ਵੇਖ ਸਕਦਾ ਹੈ (ਜਿਵੇਂ: 'ਸਿਰਫ਼ ਕਾਰਡੀਓਲੋਜੀ ਵਿਭਾਗ ਦੇ ਡਾਕਟਰ')।"
      },
      {
        title: "ਅਣਹੈਕਯੋਗ ਸਟੋਰੇਜ (IPFS)",
        desc: "ਫ਼ਾਈਲਾਂ ਮਰੀਜ਼ ਦੇ ਫ਼ੋਨ ਜਾਂ ਕੰਪਿਊਟਰ ਤੋਂ ਨਿਕਲਣ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਗੁਪਤ ਕੋਡ ਵਿੱਚ ਬਦਲ ਜਾਂਦੀਆਂ ਹਨ ਤਾਂ ਜੋ ਕੋਈ ਚੋਰੀ ਨਾ ਕਰ ਸਕੇ।"
      },
      {
        title: "ਇੱਕ ਕਲਿੱਕ ਵਿੱਚ ਪਹੁੰਚ ਰੱਦ (0.34 ਸੈਕਿੰਡ)",
        desc: "ਇਲਾਜ ਪੂਰਾ ਹੋਣ ਉੱਤੇ ਮਰੀਜ਼ ਇੱਕ ਕਲਿੱਕ ਵਿੱਚ 0.34 ਸੈਕਿੰਡ ਦੇ ਅੰਦਰ ਬਿਨਾਂ ਫ਼ਾਈਲ ਦੁਬਾਰਾ ਲਾਕ ਕੀਤੇ ਡਾਕਟਰ ਦੀ ਪਹੁੰਚ ਰੱਦ ਕਰ ਸਕਦਾ ਹੈ।"
      },
      {
        title: "ਐਮਰਜੈਂਸੀ ਜੀਵਨ-ਰੱਖਿਅਕ ਮੋਡ (Break-Glass)",
        desc: "ਸੜਕ ਹਾਦਸੇ ਜਾਂ ਬੇਹੋਸ਼ੀ ਦੀ ਹਾਲਤ ਵਿੱਚ ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ ਤੁਰੰਤ ਫ਼ਾਈਲ ਖੋਲ੍ਹ ਸਕਦੇ ਹਨ, ਪਰ ਇਸ ਦਾ ਪੱਕਾ ਸਬੂਤ ਬਲਾਕਚੈਨ ਉੱਤੇ ਦਰਜ ਹੋ ਜਾਂਦਾ ਹੈ।"
      },
      {
        title: "ਅਟੱਲ HIPAA ਆਡਿਟ ਰਿਕਾਰਡ",
        desc: "ਜਦੋਂ ਵੀ ਕੋਈ ਰਿਪੋਰਟ ਵੇਖਦਾ ਹੈ ਜਾਂ ਬਦਲਦਾ ਹੈ, ਉਹ ਜਾਣਕਾਰੀ ਬਲਾਕਚੈਨ ਉੱਤੇ ਹਮੇਸ਼ਾ ਲਈ ਸੁਰੱਖਿਅਤ ਹੋ ਜਾਂਦੀ ਹੈ ਤਾਂ ਜੋ ਕੋਈ ਚੋਰੀ-ਛਿਪੇ ਰਿਪੋਰਟ ਨਾ ਵੇਖ ਸਕੇ।"
      }
    ],
    section3_title: "3. ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ?",
    section3_intro: "5 ਆਸਾਨ ਪੜਾਵਾਂ ਵਿੱਚ ਸਮਝੋ ਕਿ ਇੱਕ ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਮਰੀਜ਼ ਤੋਂ ਡਾਕਟਰ ਤੱਕ ਸੁਰੱਖਿਅਤ ਕਿਵੇਂ ਪਹੁੰਚਦੀ ਹੈ:",
    section3_steps: [
      {
        step: "ਪੜਾਅ 1",
        title: "ਮਰੀਜ਼ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰਦਾ ਹੈ ਅਤੇ ਨਿਯਮ ਲਾਉਂਦਾ ਹੈ",
        desc: "ਮਰੀਜ਼ ਰਿਪੋਰਟ ਚੁਣਦਾ ਹੈ ਅਤੇ ਨਿਯਮ ਲਾਉਂਦਾ ਹੈ (ਜਿਵੇਂ: 'ਸਿਰਫ਼ ਦਿਲ ਦੇ ਡਾਕਟਰ ਹੀ ਖੋਲ੍ਹ ਸਕਣ')।"
      },
      {
        step: "ਪੜਾਅ 2",
        title: "ਗਣਿਤਿਕ ਦੋਹਰਾ ਤਾਲਾ ਲੱਗਣਾ",
        desc: "ਕੰਪਿਊਟਰ ਫ਼ਾਈਲ ਨੂੰ ਮਿਲਟਰੀ-ਗ੍ਰੇਡ ਐਨਕ੍ਰਿਪਸ਼ਨ ਨਾਲ ਲਾਕ ਕਰਦਾ ਹੈ ਅਤੇ ਚਾਬੀ ਨੂੰ ਮਰੀਜ਼ ਦੇ ਨਿਯਮ ਨਾਲ ਬੰਨ੍ਹ ਦਿੰਦਾ ਹੈ।"
      },
      {
        step: "ਪੜਾਅ 3",
        title: "ਡੀਸੈਂਟਰਲਾਈਜ਼ਡ ਵਾਲਟ ਵਿੱਚ ਜਮ੍ਹਾਂ",
        desc: "ਲਾਕ ਕੀਤੀ ਫ਼ਾਈਲ ਆਈਪੀਐਫਐਸ (IPFS) ਨੈੱਟਵਰਕ ਉੱਤੇ ਜਮ੍ਹਾਂ ਹੁੰਦੀ ਹੈ। ਸਰਵਰ ਮਾਲਕ ਵੀ ਇਸ ਨੂੰ ਨਹੀਂ ਪੜ੍ਹ ਸਕਦਾ।"
      },
      {
        step: "ਪੜਾਅ 4",
        title: "ਡਾਕਟਰ ਦੀ ਪਛਾਣ ਦੀ ਪੜਤਾਲ",
        desc: "ਜਦੋਂ ਡਾਕਟਰ ਲੌਗਇਨ ਕਰਦਾ ਹੈ, ਸਿਸਟਮ ਉਸ ਦੀ ਡਿਗਰੀ ਅਤੇ ਵਿਭਾਗ ਦੀ ਪੜਤਾਲ ਕਰਦਾ ਹੈ।"
      },
      {
        step: "ਪੜਾਅ 5",
        title: "ਤੁਰੰਤ ਖੁੱਲ੍ਹਣਾ ਜਾਂ ਬਲਾਕ ਹੋਣਾ",
        desc: "ਜੇਕਰ ਡਾਕਟਰ ਦੀ ਯੋਗਤਾ ਮਿਲਦੀ ਹੈ, ਤਾਂ ਰਿਪੋਰਟ 0.78 ਸੈਕਿੰਡ ਵਿੱਚ ਖੁੱਲ੍ਹ ਜਾਂਦੀ ਹੈ, ਨਹੀਂ ਤਾਂ 0.12 ਸੈਕਿੰਡ ਵਿੱਚ ਤੁਰੰਤ ਬਲਾਕ ਹੋ ਜਾਂਦੀ ਹੈ।"
      }
    ],
    section4_title: "4. ਸਾਨੂੰ ਇਸ ਦੀ ਲੋੜ ਕਿਉਂ ਹੈ?",
    section4_problem_title: "ਸਿਹਤ ਸੇਵਾ ਵਿੱਚ ਡੇਟਾ ਚੋਰੀ ਦਾ ਵੱਡਾ ਸੰਕਟ",
    section4_problem_desc: "ਪਿਛਲੇ ਸਾਲਾਂ ਵਿੱਚ 13 ਕਰੋੜ ਤੋਂ ਵੱਧ ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਹਸਪਤਾਲਾਂ ਦੇ ਡੇਟਾਬੇਸ ਤੋਂ ਚੋਰੀ ਹੋਏ ਹਨ। ਰਵਾਇਤੀ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਆਈ.ਟੀ. ਸਟਾਫ ਜਾਂ ਹੈਕਰ ਮਰੀਜ਼ ਦੀਆਂ ਨਿੱਜੀ ਬਿਮਾਰੀਆਂ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਵੇਖ ਸਕਦੇ ਹਨ। ਮਰੀਜ਼ ਦਾ ਆਪਣੀ ਰਿਪੋਰਟ ਉੱਤੇ ਕੋਈ ਕੰਟਰੋਲ ਨਹੀਂ ਰਹਿੰਦਾ।",
    section4_benefits_title: "ਕਿਸ ਨੂੰ ਲਾਭ ਹੁੰਦਾ ਹੈ?",
    section4_benefits: [
      {
        who: "ਮਰੀਜ਼ਾਂ ਲਈ",
        desc: "ਪੂਰਾ ਭਰੋਸਾ ਕਿ ਉਹਨਾਂ ਦਾ ਸਿਹਤ ਰਿਕਾਰਡ ਬਿਲਕੁਲ ਨਿੱਜੀ ਰਹੇਗਾ ਅਤੇ ਉਹ ਕਦੇ ਵੀ ਡਾਕਟਰ ਦੀ ਇਜਾਜ਼ਤ ਰੱਦ ਕਰ ਸਕਦੇ ਹਨ।"
      },
      {
        who: "ਡਾਕਟਰਾਂ ਲਈ",
        desc: "ਦੂਜੇ ਹਸਪਤਾਲਾਂ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਲਈ ਦਿਨਾਂ ਤੱਕ ਉਡੀਕ ਨਹੀਂ ਕਰਨੀ ਪੈਂਦੀ, 0.78 ਸੈਕਿੰਡ ਵਿੱਚ ਤੁਰੰਤ ਇਲਾਜ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।"
      },
      {
        who: "ਹਸਪਤਾਲਾਂ ਲਈ",
        desc: "ਡੇਟਾ ਚੋਰੀ ਅਤੇ ਰੈਨਸਮਵੇਅਰ ਦੇ ਹਮਲਿਆਂ ਤੋਂ 100% ਸੁਰੱਖਿਆ, ਨਾਲ ਹੀ HIPAA ਅਤੇ GDPR ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ।"
      }
    ],
    section5_title: "5. ਇਹ ਰਵਾਇਤੀ ਤਰੀਕਿਆਂ ਨਾਲੋਂ ਕਿਵੇਂ ਵੱਖਰਾ ਹੈ?",
    section5_intro: "ਆਮ ਹਸਪਤਾਲ ਪ੍ਰਣਾਲੀਆਂ ਅਤੇ ਪੁਰਾਣੇ ਬਲਾਕਚੈਨ ਪ੍ਰੋਜੈਕਟਾਂ ਨਾਲ ਤੁਲਨਾ:",
    section5_comparisons: [
      {
        system: "ਆਮ ਹਸਪਤਾਲ ਪ੍ਰਣਾਲੀ (Epic / Cerner / AWS)",
        drawback: "ਸਾਰਾ ਡੇਟਾ ਕੇਂਦਰੀ ਕੰਪਿਊਟਰ ਉੱਤੇ ਸਾਫ਼ ਸ਼ਬਦਾਂ ਵਿੱਚ ਹੁੰਦਾ ਹੈ; ਇੱਕ ਪਾਸਵਰਡ ਹੈਕ ਹੋਣ ਨਾਲ ਲੱਖਾਂ ਮਰੀਜ਼ਾਂ ਦਾ ਡੇਟਾ ਲੀਕ ਹੋ ਜਾਂਦਾ ਹੈ।",
        securechain: "ਡੇਟਾ ਮਰੀਜ਼ ਦੇ ਯੰਤਰ ਤੋਂ ਹੀ ਗਣਿਤਿਕ ਤਰੀਕੇ ਨਾਲ ਲਾਕ ਹੋ ਕੇ ਨਿਕਲਦਾ ਹੈ; ਕੋਈ ਕੇਂਦਰੀ ਸਰਵਰ ਨਹੀਂ ਹੈ ਜਿਸ ਨੂੰ ਹੈਕ ਕੀਤਾ ਜਾ ਸਕੇ।"
      },
      {
        system: "ਪੁਰਾਣੇ ਬਲਾਕਚੈਨ ਪ੍ਰੋਜੈਕਟ (MedRec / MIT)",
        drawback: "ਡਾਕਟਰ ਦੀ ਇਜਾਜ਼ਤ ਹਟਾਉਣ ਵਿੱਚ 2.0 ਸੈਕਿੰਡ ਲੱਗਦੇ ਹਨ ਅਤੇ ਆਮ ਐਸਕਿਊਐਲ ਡੇਟਾਬੇਸ ਵਿੱਚ ਲੌਗ ਰੱਖੇ ਜਾਂਦੇ ਹਨ।",
        securechain: "ਮਲਟੀ-ਐਟਰੀਬਿਊਟ ਬੂਲੀਅਨ ਨਿਯਮ; ਇਜਾਜ਼ਤ ਸਿਰਫ਼ 0.34 ਸੈਕਿੰਡ ਵਿੱਚ ਰੱਦ; ਸਾਰੇ ਆਡਿਟ ਲੌਗ ਬਲਾਕਚੈਨ ਉੱਤੇ ਪੱਕੇ ਸੁਰੱਖਿਅਤ।"
      },
      {
        system: "ਆਮ ਪਬਲਿਕ-ਕੀ ਕ੍ਰਿਪਟੋਗ੍ਰਾਫੀ (RSA / ECC)",
        drawback: "ਜੇਕਰ 50 ਡਾਕਟਰਾਂ ਨੂੰ ਰਿਪੋਰਟ ਦੇਣੀ ਹੋਵੇ, ਤਾਂ 50 ਵੱਖਰੀਆਂ ਕਾਪੀਆਂ ਬਣਾਉਣੀਆਂ ਪੈਂਦੀਆਂ ਹਨ, ਜੋ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਅਸੰਭਵ ਹੈ।",
        securechain: "ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਨਿਯਮ ਨਾਲ ਲਾਕ ਕਰੋ; ਕੋਈ ਵੀ ਯੋਗ ਡਾਕਟਰ ਆਪਣੀ ਚਾਬੀ ਨਾਲ ਤੁਰੰਤ ਰਿਪੋਰਟ ਖੋਲ੍ਹ ਸਕਦਾ ਹੈ।"
      }
    ]
  }
};

export default function AboutProjectPage() {
  const [selectedLang, setSelectedLang] = useState<LanguageKey>("en");
  const content = CONTENT[selectedLang];
  const isRtl = selectedLang === "ur";

  const languages = [
    { key: "en", label: "English", native: "English", flag: "🇬🇧" },
    { key: "hi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
    { key: "ur", label: "Urdu", native: "اردو", flag: "🇵🇰" },
    { key: "hinglish", label: "Hinglish", native: "Roman English", flag: "🗣️" },
    { key: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  ];

  return (
    <div className={`space-y-12 py-2 ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Header Banner & Language Switcher */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br from-teal-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-6 max-w-4xl">
          {/* Top Pill & Language Picker */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Compass className="w-4 h-4 text-teal-400" />
              {selectedLang === "en" && "Official Project Overview & Presentation Guide"}
              {selectedLang === "hi" && "प्रोजेक्ट परिचय एवं प्रेजेंटेशन गाइड"}
              {selectedLang === "ur" && "پروجیکٹ کا تعارف اور پریزنٹیشن گائیڈ"}
              {selectedLang === "hinglish" && "Project Overview & Presentation Guide"}
              {selectedLang === "pa" && "ਪ੍ਰੋਜੈਕਟ ਜਾਣ-ਪਛਾਣ ਅਤੇ ਪ੍ਰੈਜ਼ੈਂਟੇਸ਼ਨ ਗਾਈਡ"}
            </span>

            {/* Language Switcher Bar */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-cyber-border shadow-lg flex-wrap">
              <div className="flex items-center gap-1.5 px-2 text-xs text-slate-400 font-medium">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Language:</span>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => setSelectedLang(lang.key as LanguageKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedLang === lang.key
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold shadow-glow-teal scale-102"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            SecureChain:{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              {selectedLang === "en" && "Decentralized Medical Access Control"}
              {selectedLang === "hi" && "मरीजों के नियंत्रण में सुरक्षित मेडिकल लॉकर"}
              {selectedLang === "ur" && "مریض کے مکمل کنٹرول میں محفوظ میڈیکل ریکارڈ"}
              {selectedLang === "hinglish" && "Patient-Controlled Decentralized Medical Locker"}
              {selectedLang === "pa" && "ਮਰੀਜ਼ਾਂ ਦੇ ਕੰਟਰੋਲ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਮੈਡੀਕਲ ਲਾਕਰ"}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {selectedLang === "en" && "A complete, jargon-free guide explaining what this capstone project does, how it works, why it is necessary, and why it is 100x better than traditional hospital databases."}
            {selectedLang === "hi" && "सरल और आसान भाषा में समझें कि यह प्रोजेक्ट क्या करता है, कैसे काम करता है, हमें इसकी आवश्यकता क्यों है, और यह सामान्य अस्पतालों से बेहतर क्यों है।"}
            {selectedLang === "ur" && "آسان الفاظ میں سمجھیں کہ یہ پراجیکٹ کیا کرتا ہے، کیسے کام کرتا ہے، اور عام ہسپتالوں کے مقابلے میں کیوں محفوظ اور بہتر ہے۔"}
            {selectedLang === "hinglish" && "Simple language me samjhein ki yeh project kya karta hai, kaise kaam karta hai, iski zaroorat kyun hai aur yeh normal hospital system se 100x better kyun hai."}
            {selectedLang === "pa" && "ਸਰਲ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝੋ ਕਿ ਇਹ ਪ੍ਰੋਜੈਕਟ ਕੀ ਕਰਦਾ ਹੈ, ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ, ਸਾਨੂੰ ਇਸ ਦੀ ਲੋੜ ਕਿਉਂ ਹੈ, ਅਤੇ ਇਹ ਆਮ ਹਸਪਤਾਲਾਂ ਨਾਲੋਂ ਬਿਹਤਰ ਕਿਉਂ ਹੈ।"}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/results"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-glow-teal flex items-center gap-2 transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              {selectedLang === "en" && "View Project Results & Benchmarks"}
              {selectedLang === "hi" && "प्रोजेक्ट परिणाम और टेस्ट देखें"}
              {selectedLang === "ur" && "پراجیکٹ کے نتائج اور ٹیسٹ دیکھیں"}
              {selectedLang === "hinglish" && "View Project Results & Benchmarks"}
              {selectedLang === "pa" && "ਪ੍ਰੋਜੈਕਟ ਨਤੀਜੇ ਅਤੇ ਬੈਂਚਮਾਰਕ ਵੇਖੋ"}
            </Link>
            <Link
              href="/viva-defense"
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              {selectedLang === "en" && "Viva Defense Simulator"}
              {selectedLang === "hi" && "वाइवा डिफेंस सिम्युलेटर"}
              {selectedLang === "ur" && "وائیوا ڈیفنس سمیلیٹر"}
              {selectedLang === "hinglish" && "Viva Defense Simulator"}
              {selectedLang === "pa" && "ਵਾਈਵਾ ਡਿਫੈਂਸ ਸਿਮੂਲੇਟਰ"}
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: WHAT IS THIS PROJECT? */}
      {/* ========================================================================= */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-teal-500/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider">Elevator Pitch</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{content.section1_title}</h2>
          </div>
        </div>

        <div className="space-y-3 text-sm sm:text-base text-slate-200 leading-relaxed pt-2">
          {content.section1_text.map((paragraph, idx) => (
            <p key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: WHAT DOES IT DO? */}
      {/* ========================================================================= */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-border shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Core Capabilities</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{content.section2_title}</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">{content.section2_intro}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.section2_bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-cyber-border hover:border-teal-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-125 transition-transform" />
                <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  {bullet.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{bullet.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: HOW DOES IT WORK? */}
      {/* ========================================================================= */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-border shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">Step-by-Step Flow</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{content.section3_title}</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">{content.section3_intro}</p>

        <div className="space-y-3">
          {content.section3_steps.map((st, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-slate-950 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 shadow-glow-teal">
                  0{idx + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-500 self-end sm:self-center px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                {st.step}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: WHY DO WE NEED THIS? */}
      {/* ========================================================================= */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-border shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">Real-World Problem & Value</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{content.section4_title}</h2>
          </div>
        </div>

        {/* The Crisis Box */}
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> {content.section4_problem_title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {content.section4_problem_desc}
          </p>
        </div>

        {/* The 3 Beneficiaries */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
            {content.section4_benefits_title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.section4_benefits.map((b, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-cyber-border space-y-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  {b.who}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: HOW IS IT DIFFERENT? */}
      {/* ========================================================================= */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-border shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">Competitive Advantage</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{content.section5_title}</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">{content.section5_intro}</p>

        <div className="space-y-4">
          {content.section5_comparisons.map((c, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-cyber-border space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-rose-400 font-mono">VS</span> {c.system}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-slate-300 space-y-1">
                  <span className="text-[11px] font-bold text-rose-300 uppercase block">Drawback / Limitation:</span>
                  <p className="leading-relaxed">{c.drawback}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/40 text-slate-200 space-y-1 shadow-glow-teal">
                  <span className="text-[11px] font-bold text-teal-300 uppercase block">SecureChain Advantage:</span>
                  <p className="leading-relaxed">{c.securechain}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white">
            Ready to test SecureChain live?
          </h4>
          <p className="text-xs text-slate-400">
            Open the Patient Portal to upload records, or the Doctor Portal to test policy decryption.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/patient"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all hover:scale-105"
          >
            Patient Portal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/doctor"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105"
          >
            Doctor Portal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
