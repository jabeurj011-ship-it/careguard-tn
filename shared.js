<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>الخيارات المعتمدة في تطبيقات أوبر والتوصيل — دليل مرجعي</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet" />
  <style>
    /* Utilitarian · On-Demand Mobility & Delivery Standards · Compact answer-first hero · 5 open sections + Sources · Cairo + IBM Plex Mono · Crisp white (#FFFFFF) + Deep Teal (#0F766E / #115E59) + Cobalt (#1D4ED8) · 0px radius · Hero benchmark strip · Inline SVG 3-model dispatch diagram + 2 open tables */
    :root {
      --paper: #FFFFFF;
      --ink: #0F172A;
      --ink2: #1E293B;
      --mute: #475569;
      --hair: #CBD5E1;
      --accent: #0F766E;
      --accent-text: #115E59;
      --accent-2: #1D4ED8;
      --accent-2-text: #1E40AF;
    }

    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: var(--paper);
      color: var(--ink);
      font-family: 'Cairo', sans-serif;
      font-size: 16px;
      line-height: 1.75;
      -webkit-font-smoothing: antialiased;
    }

    main {
      width: 100%;
      padding: 48px clamp(20px, 8vw, 108px) 84px;
    }

    .measure { max-width: 68ch; }

    /* Hero */
    h1 {
      margin: 0 0 14px;
      font-size: clamp(32px, 4.6vw, 52px);
      font-weight: 900;
      line-height: 1.2;
      letter-spacing: -0.02em;
      text-wrap: balance;
      color: var(--ink);
    }

    .deck {
      margin: 0 0 28px;
      font-size: 18px;
      font-weight: 600;
      color: var(--ink2);
      max-width: 64ch;
    }

    /* Inline Hero Benchmark Strip (Open Canvas, 0 cards) */
    .bench-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px;
      border-top: 2px solid var(--ink);
      border-bottom: 1px solid var(--hair);
      padding: 20px 0;
      margin-bottom: 56px;
    }
    .bench-val {
      font-family: 'IBM Plex Mono', 'Cairo', monospace;
      font-size: clamp(28px, 3.6vw, 42px);
      font-weight: 600;
      line-height: 1.1;
      color: var(--accent-text);
      white-space: nowrap;
    }
    .bench-desc {
      margin: 6px 0 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--mute);
      line-height: 1.5;
    }

    /* Sections */
    .sec {
      margin-top: 64px;
      padding-top: 28px;
      border-top: 1px solid var(--hair);
    }
    .sec:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }

    h2 {
      margin: 0 0 16px;
      font-size: clamp(24px, 2.8vw, 32px);
      font-weight: 800;
      line-height: 1.3;
      color: var(--ink);
      text-wrap: balance;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 19px;
      font-weight: 800;
      color: var(--accent-text);
    }

    p {
      margin: 0 0 16px;
      color: var(--ink2);
      font-size: 16px;
    }

    a {
      color: var(--accent-2-text);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    a:hover { color: var(--accent-text); }

    /* Figures & SVG */
    figure {
      margin: 28px 0 32px;
      padding: 0;
      width: 100%;
    }
    .fig-title {
      font-size: 17px;
      font-weight: 800;
      color: var(--ink);
      margin: 0 0 12px;
    }
    figcaption {
      margin-top: 10px;
      font-size: 13px;
      color: var(--mute);
    }

    /* Open Tables (0 cards, no zebra stripes) */
    .table-wrap {
      width: 100%;
      overflow-x: auto;
      margin: 20px 0 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
      text-align: right;
    }
    th {
      font-weight: 800;
      font-size: 13px;
      color: var(--ink);
      border-top: 2px solid var(--ink);
      border-bottom: 1px solid var(--ink);
      padding: 12px 10px;
      vertical-align: bottom;
    }
    td {
      padding: 13px 10px;
      border-bottom: 1px solid var(--hair);
      vertical-align: top;
      color: var(--ink2);
    }
    .mono {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      white-space: nowrap;
      color: var(--accent-text);
      font-weight: 600;
    }
    .status-ok { color: var(--accent-text); font-weight: 800; white-space: nowrap; }
    .status-next { color: var(--accent-2-text); font-weight: 800; white-space: nowrap; }

    /* Open Multi-Column Strips */
    .cols-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 36px;
      margin-top: 20px;
    }
    .col-item {
      border-top: 1px solid var(--hair);
      padding-top: 16px;
    }

    /* Asymmetric Split */
    .split {
      display: grid;
      grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
      gap: 24px 40px;
      align-items: start;
    }

    /* Pull Quote / Callout */
    blockquote {
      margin: 36px 0;
      padding: 8px 24px 8px 0;
      border-right: 4px solid var(--accent);
      font-size: clamp(20px, 2.4vw, 26px);
      font-weight: 800;
      line-height: 1.5;
      color: var(--ink);
    }

    /* Clean Lists */
    ul.clean, ol.sources {
      margin: 12px 0 0;
      padding: 0 22px 0 0;
    }
    ul.clean li, ol.sources li {
      margin-bottom: 10px;
      color: var(--ink2);
    }
    ol.sources li { font-size: 14px; }

    @media (max-width: 760px) {
      .bench-strip, .cols-2, .split {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      main { padding: 32px 18px 64px; }
    }
  </style>
</head>
<body>
<main>
  <header>
    <h1>خمس ركائز تشغيلية تعتمدها تطبيقات أوبر والتوصيل لإدارة الطلبات بأمان وسرعة</h1>
    <p class="deck">خلاصة الخيارات القياسية المعمول بها في منصات النقل والتوصيل العالمية مثل Uber وBolt وinDrive وDoorDash وUber Eats، مع توضيح ما تملكه بالفعل في CareGuard TN وما يستحق إضافته للخدمات المنزلية في تونس.</p>
  </header>

  <div class="bench-strip" aria-label="أرقام مرجعية في القطاع">
    <div>
      <div class="bench-val">15s</div>
      <p class="bench-desc">المهلة القياسية لقبول الطلب في التوزيع المتسلسل قبل تحويله تلقائياً للمزوّد التالي.</p>
    </div>
    <div>
      <div class="bench-val">4 PIN</div>
      <p class="bench-desc">رمز تحقق من 4 أرقام يسلّمه الزبون عند الوصول لمنع الزيارات الوهمية وتأكيد الهوية.</p>
    </div>
    <div>
      <div class="bench-val">6–12%</div>
      <p class="bench-desc">نطاق عمولة نموذج التفاوض (inDrive) مقابل 20–30% في نموذج التسعير الخوارزمي.</p>
    </div>
  </div>

  <!-- Section 1 -->
  <section class="sec">
    <h2>توزيع الطلبات لا يعتمد على المسافة وحدها بل على ثلاث آليات مطابقة</h2>
    <p class="measure">تعتمد تطبيقات النقل والتوصيل على محرك مطابقة يوازن بين وقت الوصول الفعلي (<a href="https://www.uber.com/ca/en/blog/deepeta-how-uber-predicts-arrival-times/" target="_blank" rel="noopener noreferrer">Uber DeepETA</a>)، ومعدل القبول، وتقييم المزوّد، وليس مجرد خط مستقيم على الخريطة (<a href="https://dev.to/ishaanthedev/designing-uber-a-real-time-ride-matching-system-at-scale-pc9" target="_blank" rel="noopener noreferrer">Designing Uber</a>). في التطبيقات الميدانية توجد ثلاث طرق رئيسية لإيصال الطلب:</p>

    <figure>
      <div class="fig-title">البث الجماعي أسرع استجابةً لكن التوزيع المتسلسل والمزاد يعالجان الازدحام والأسعار</div>
      <svg viewBox="0 0 700 380" width="100%" role="img" aria-label="مقارنة ثلاث آليات لتوزيع الطلبات في تطبيقات أوبر والتوصيل">
        <!-- Row 1: Sequential -->
        <line x1="20" y1="32" x2="680" y2="32" stroke="#CBD5E1" stroke-width="1" />
        <text x="676" y="64" text-anchor="end" font-family="Cairo, sans-serif" font-size="16" font-weight="800" fill="#0F172A">1. التوزيع المتسلسل (Uber / Bolt)</text>
        <rect x="490" y="80" width="185" height="44" fill="#F1F5F9" stroke="#0F766E" stroke-width="2" />
        <text x="582" y="107" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="700" fill="#0F172A">أقرب مزوّد (مهلة 15 ثانية)</text>
        <line x1="490" y1="102" x2="445" y2="102" stroke="#475569" stroke-width="2" />
        <polygon points="445,97 435,102 445,107" fill="#475569" />
        <rect x="245" y="80" width="185" height="44" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
        <text x="337" y="107" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="700" fill="#1E293B">المزوّد الثاني تلقائياً</text>
        <line x1="245" y1="102" x2="200" y2="102" stroke="#475569" stroke-width="2" />
        <polygon points="200,97 190,102 200,107" fill="#475569" />
        <rect x="24" y="80" width="160" height="44" fill="#0F766E" />
        <text x="104" y="107" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">تثبيت فوري للطلب</text>

        <!-- Row 2: Broadcast -->
        <line x1="20" y1="152" x2="680" y2="152" stroke="#CBD5E1" stroke-width="1" />
        <text x="676" y="184" text-anchor="end" font-family="Cairo, sans-serif" font-size="16" font-weight="800" fill="#0F172A">2. البث الجماعي السريع (نموذج CareGuard الحالي)</text>
        <rect x="490" y="200" width="185" height="44" fill="#F1F5F9" stroke="#1D4ED8" stroke-width="2" />
        <text x="582" y="227" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="700" fill="#0F172A">إشعار لكل مزوّدي الولاية</text>
        <line x1="490" y1="222" x2="445" y2="222" stroke="#475569" stroke-width="2" />
        <polygon points="445,217 435,222 445,227" fill="#475569" />
        <rect x="245" y="200" width="185" height="44" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
        <text x="337" y="227" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="700" fill="#1E293B">أول من يضغط «قبول» يفوز</text>
        <line x1="245" y1="222" x2="200" y2="222" stroke="#475569" stroke-width="2" />
        <polygon points="200,217 190,222 200,227" fill="#475569" />
        <rect x="24" y="200" width="160" height="44" fill="#1D4ED8" />
        <text x="104" y="227" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">إغلاق فوري للبقية</text>

        <!-- Row 3: Reverse Bidding -->
        <line x1="20" y1="272" x2="680" y2="272" stroke="#CBD5E1" stroke-width="1" />
        <text x="676" y="304" text-anchor="end" font-family="Cairo, sans-serif" font-size="16" font-weight="800" fill="#0F172A">3. التفاوض وعروض الأسعار (inDrive)</text>
        <rect x="490" y="320" width="185" height="44" fill="#F1F5F9" stroke="#0F766E" stroke-width="2" />
        <text x="582" y="347" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="700" fill="#0F172A">الزبون يقترح السعر أو الطلب</text>
        <line x1="490" y1="342" x2="445" y2="342" stroke="#475569" stroke-width="2" />
        <polygon points="445,337 435,342 445,347" fill="#475569" />
        <rect x="245" y="320" width="185" height="44" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
        <text x="337" y="347" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="700" fill="#1E293B">المزوّدون يرسلون عروضهم</text>
        <line x1="245" y1="342" x2="200" y2="342" stroke="#475569" stroke-width="2" />
        <polygon points="200,337 190,342 200,347" fill="#475569" />
        <rect x="24" y="320" width="160" height="44" fill="#0F172A" />
        <text x="104" y="347" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="800" fill="#FFFFFF">الزبون يختار الأنسب</text>
      </svg>
      <figcaption>المصدر: تركيب معماري اعتماداً على توثيق Uber Engineering وinDrive.</figcaption>
    </figure>
  </section>

  <!-- Section 2 -->
  <section class="sec">
    <h2>مقارنة النماذج العالمية في التسعير، الشفافية، ومهلة القبول</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>المنصة / النموذج</th>
            <th>توزيع الطلب</th>
            <th>آلية التسعير</th>
            <th>ما يراه المزوّد قبل القبول</th>
            <th>أنسب استخدام في تونس</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Uber / Bolt</strong></td>
            <td>متسلسل حسب وقت الوصول (ETA) مع مهلة <span class="mono">15s</span></td>
            <td>سعر ثابت أو ديناميكي تحدده المنصة</td>
            <td>المسافة، وقت الوصول، وتقييم الزبون</td>
            <td>الحالات المستعجلة التي تحتاج أسرع استجابة</td>
          </tr>
          <tr>
            <td><strong>DoorDash / Uber Eats</strong></td>
            <td>عرض مباشر مع وقت تسليم متوقع وحساب للربح</td>
            <td>أجر أساسي + مسافة + إكرامية اختيارية</td>
            <td>الخريطة، المسافة الكلية، والأجر المتوقع (<a href="https://therideshareguy.com/best-delivery-acceptance-screen/" target="_blank" rel="noopener noreferrer">Rideshare Guy</a>)</td>
            <td>الزيارات النمطية ذات التعريفة الواضحة (حقنة، ضماد)</td>
          </tr>
          <tr>
            <td><strong>inDrive</strong></td>
            <td>بث للمزوّدين القريبين مع عروض متبادلة</td>
            <td>الزبون يقترح سعراً والمزوّد يقبل أو يقترح بديلاً (<a href="https://indrive.com/price-estimate" target="_blank" rel="noopener noreferrer">inDrive</a>)</td>
            <td>تفاصيل الطلب، المسافة، والسعر المقترح</td>
            <td>خدمات الحرفيين والصيانة المنزلية المتفاوتة التكلفة</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Section 3 -->
  <section class="sec">
    <h2>معايير الأمان والتحقق تحمي الطرفين قبل فتح الباب</h2>
    <p class="measure">في الخدمات التي تتطلب دخول المنزل، تصبح ميزات الثقة والأمان هي الفارق الحقيقي بين تطبيق يعتمد عليه الناس وتطبيق يتجنبونه. تعتمد المنصات الكبرى أربع أدوات أساسية:</p>

    <div class="cols-2">
      <div class="col-item">
        <h3>رمز التحقق PIN عند الوصول</h3>
        <p>يظهر للزبون رمز من 4 أرقام لا يمكن للمزوّد بدء الخدمة في التطبيق إلا بعد إدخاله (<a href="https://www.uber.com/au/en/blog/verify-your-ride/" target="_blank" rel="noopener noreferrer">Uber PIN</a>)، كما تعتمده <a href="https://help.uber.com/en/business/article/understanding-rider-pickup-pin-code-verification?nodeId=fc48bc82-c6ea-4833-83fd-ead478628280" target="_blank" rel="noopener noreferrer">Uber Health</a> لمنع بدء الزيارات الوهمية وتأكيد هوية الشخص عند الباب.</p>
      </div>
      <div class="col-item">
        <h3>إخفاء الأرقام والتوثيق بالصورة</h3>
        <p>تعتمد <a href="https://bolt.eu/en/rides/safety/" target="_blank" rel="noopener noreferrer">Bolt</a> إخفاء رقم الهاتف الحقيقي أثناء الاتصال، مع مطالبة المزوّد بصورة سيلفي حية دورياً للتأكد أن صاحب الحساب هو نفسه من يقدّم الخدمة (<a href="https://bolt.eu/en-nz/driver/guide/app-trip-recording/" target="_blank" rel="noopener noreferrer">Bolt Guide</a>).</p>
      </div>
      <div class="col-item">
        <h3>مشاركة المسار وزر الطوارئ</h3>
        <p>يتيح التطبيق للزبون أو عائلته تتبع حركة المزوّد لحظياً على الخريطة مع زر طوارئ سريع يرسل الموقع فوراً لفريق السلامة أو جهة الاتصال الموثوقة (<a href="https://bolt.eu/en/rides/safety/" target="_blank" rel="noopener noreferrer">Bolt Safety</a>).</p>
      </div>
      <div class="col-item">
        <h3>حدّ الإرهاق ومنع العمل خارج التطبيق</h3>
        <p>تفصل <a href="https://www.uber.com/za/en/blog/uber-eats-driving-time-limit/" target="_blank" rel="noopener noreferrer">Uber Eats</a> المزوّد تلقائياً لمدة 6 ساعات بعد 12 ساعة عمل متواصلة حفاظاً على السلامة، بينما تفرض المنصات عقوبات على محاولة الاتفاق خارج التطبيق لأن ذلك يلغي التتبع والحماية (<a href="https://businessnow.co.ke/how-to-cancel-an-offline-trip-on-bolt-to-enhance-your-safety/" target="_blank" rel="noopener noreferrer">Bolt Policy</a>).</p>
      </div>
    </div>
  </section>

  <!-- Section 4 -->
  <section class="sec">
    <div class="split">
      <div>
        <h2>تفاصيل تجربة الطلب التي ترفع نسبة الإنجاز</h2>
      </div>
      <div>
        <p>بعيداً عن الخريطة، تعتمد تطبيقات التوصيل على سلسلة حالات دقيقة تمنع القلق والاتصالات المتكررة، مع قواعد واضحة للإلغاء والمواعيد:</p>
        <ul class="clean">
          <li><strong>تسلسل الحالات الواضح:</strong> ينتقل الطلب عبر مراحل مرئية للطرفين (تم الإرسال، تم القبول، في الطريق، وصل إلى العنوان، قيد التنفيذ، مكتمل) مع عرض الوقت المتوقع لكل مرحلة (<a href="https://help.uber.com/driving-and-delivering/article/anticipated-delivery-time-feature-faqs?nodeId=71c5c4e5-327d-4868-842f-7dd29e4f3694" target="_blank" rel="noopener noreferrer">Uber Help</a>).</li>
          <li><strong>الانتهاء التلقائي للطلب غير المقبول:</strong> إذا لم يقبل أي مزوّد الطلب خلال مدة محددة (مثلاً 15–30 دقيقة)، يُغلق الطلب تلقائياً ويُشعر الزبون بدل بقائه معلقاً لساعات.</li>
          <li><strong>الجدولة المسبقة:</strong> تتيح منصات مثل <a href="https://play.google.com/store/apps/details?id=ee.mtakso.client" target="_blank" rel="noopener noreferrer">Bolt</a> حجز موعد مسبق قبل 30 دقيقة وحتى 90 يوماً، وهو خيار مثالي لجلسات التمريض المنتظمة كالحقن اليومية وتغيير الضمادات.</li>
          <li><strong>حماية ضد الإلغاء المتأخر:</strong> تطبّق المنصات فترة سماح قصيرة للإلغاء المجاني، وبعد تحرك المزوّد يُسجّل سبب الإلغاء لتقييم الالتزام ومنع الإلغاءات المتكررة (<a href="https://bolt.eu/en-py/legal/rides/tnc-drivers/" target="_blank" rel="noopener noreferrer">Bolt Terms</a>).</li>
        </ul>
      </div>
    </div>
  </section>

  <blockquote>أفضل نموذج للرعاية التمريضية في تونس يجمع بين «البث السريع داخل الولاية» للحالات العاجلة، و«الجدولة المسبقة + رمز التحقق PIN» للزيارات المنزلية الآمنة.</blockquote>

  <!-- Section 5 -->
  <section class="sec">
    <h2>موقع CareGuard TN حالياً مقارنةً بمعايير القطاع</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>الميزة القياسية</th>
            <th>الحالة في CareGuard TN</th>
            <th>التوصية العملية</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>تصفية نفس الولاية + ترتيب الأقرب فالأقرب</td>
            <td class="status-ok">موجود (v2.4-TN)</td>
            <td>جاهز ويعمل بالـ GPS لجميع ولايات تونس الـ 24</td>
          </tr>
          <tr>
            <td>قبول ذري يمنع تداخل ممرضين على نفس الطلب</td>
            <td class="status-ok">موجود (RPC)</td>
            <td>يضمن فوز أول ممرض يقبل وإغلاق الطلب فوراً للبقية</td>
          </tr>
          <tr>
            <td>التوجيه بـ Google Maps + التقييم والحظر والتعليق</td>
            <td class="status-ok">موجود</td>
            <td>إغلاق متبادل بين الممرض والمسنّ لكشف أي تضارب</td>
          </tr>
          <tr>
            <td>انتهاء صلاحية تلقائي للطلب المفتوح (مثلاً بعد 60 دقيقة)</td>
            <td class="status-next">مقترح قريباً</td>
            <td>يمنع تراكم طلبات قديمة على شاشة الممرضين</td>
          </tr>
          <tr>
            <td>رمز تحقق PIN من 4 أرقام عند باب المنزل</td>
            <td class="status-next">مقترح قريباً</td>
            <td>يرفع ثقة العائلات ويمنع تسجيل زيارة وهمية</td>
          </tr>
          <tr>
            <td>الجدولة المسبقة (تحديد ساعة ويوم الزيارة)</td>
            <td class="status-next">مقترح قريباً</td>
            <td>أساسي للحقن الصباحية أو الضمادات المتكررة</td>
          </tr>
          <tr>
            <td>نظام عروض أسعار متبادلة (مثل inDrive)</td>
            <td class="status-next">لتطبيق الحرفيين</td>
            <td>ممتاز للصيانة والسباكة والكهرباء حيث تختلف التكلفة</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Sources -->
  <section class="sec">
    <h2>المصادر</h2>
    <ol class="sources">
      <li><a href="https://www.uber.com/ca/en/blog/deepeta-how-uber-predicts-arrival-times/" target="_blank" rel="noopener noreferrer">Uber Engineering — DeepETA: How Uber Predicts Arrival Times Using Deep Learning</a></li>
      <li><a href="https://dev.to/ishaanthedev/designing-uber-a-real-time-ride-matching-system-at-scale-pc9" target="_blank" rel="noopener noreferrer">Designing Uber: A Real-Time Ride Matching System at Scale (Offer Timeouts &amp; Matching)</a></li>
      <li><a href="https://www.uber.com/au/en/blog/verify-your-ride/" target="_blank" rel="noopener noreferrer">Uber — PIN Verification (Verify Your Ride Safety Feature)</a></li>
      <li><a href="https://help.uber.com/en/business/article/understanding-rider-pickup-pin-code-verification?nodeId=fc48bc82-c6ea-4833-83fd-ead478628280" target="_blank" rel="noopener noreferrer">Uber for Business / Uber Health — Understanding Rider Pickup PIN Code Verification</a></li>
      <li><a href="https://www.uber.com/za/en/blog/uber-eats-driving-time-limit/" target="_blank" rel="noopener noreferrer">Uber Eats — Driving Time Limit (12h Active / 6h Rest Safety Policy)</a></li>
      <li><a href="https://help.uber.com/driving-and-delivering/article/anticipated-delivery-time-feature-faqs?nodeId=71c5c4e5-327d-4868-842f-7dd29e4f3694" target="_blank" rel="noopener noreferrer">Uber Help — Anticipated Delivery Time Feature FAQs</a></li>
      <li><a href="https://bolt.eu/en/rides/safety/" target="_blank" rel="noopener noreferrer">Bolt — Safety Features (Phone Masking, GPS Tracking, Emergency Assist)</a></li>
      <li><a href="https://bolt.eu/en-nz/driver/guide/app-trip-recording/" target="_blank" rel="noopener noreferrer">Bolt Driver Guide — Identity Verification, Trip Sharing &amp; Safety Tools</a></li>
      <li><a href="https://indrive.com/price-estimate" target="_blank" rel="noopener noreferrer">inDrive — Fair Fare Negotiation &amp; Reverse-Bidding Model</a></li>
      <li><a href="https://therideshareguy.com/best-delivery-acceptance-screen/" target="_blank" rel="noopener noreferrer">The Rideshare Guy — Delivery App Acceptance Screens (DoorDash / Uber Eats)</a></li>
    </ol>
  </section>
</main>
</body>
</html>