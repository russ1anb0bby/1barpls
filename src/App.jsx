import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ═══ GLOBAL STYLES ═══
const globalCSS = `
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    background: #050505;
    color: #e8e8e8;
  }
  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  @keyframes twinkle {
    0% { opacity: 0.03; }
    100% { opacity: 0.18; }
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(8px, -12px); }
    66% { transform: translate(-6px, 8px); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.03); }
    50% { box-shadow: 0 0 40px rgba(255,255,255,0.06); }
  }
  @keyframes subtleBreathe {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
  @keyframes leafFall {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(8px) rotate(15deg) translateX(5px); }
    50% { transform: translateY(16px) rotate(-5deg) translateX(-3px); }
    75% { transform: translateY(8px) rotate(10deg) translateX(4px); }
  }
  @keyframes bgTransition {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes quoteReveal {
    from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes metaReveal {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes homeExit {
    to { opacity: 0; transform: scale(0.96); filter: blur(6px); }
  }

  /* 3D Animations */
  @keyframes spin3d {
    0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  }
  @keyframes rock3d {
    0%, 100% { transform: rotateX(15deg) rotateY(-5deg); }
    50% { transform: rotateX(10deg) rotateY(5deg); }
  }
  @keyframes orbit3d {
    0% { transform: rotateY(0deg) translateX(40px) rotateY(0deg); }
    100% { transform: rotateY(360deg) translateX(40px) rotateY(-360deg); }
  }
  @keyframes tumble3d {
    0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
    100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
  }
  @keyframes float3d {
    0%, 100% { transform: perspective(600px) rotateX(12deg) rotateY(-8deg) translateZ(0); }
    50% { transform: perspective(600px) rotateX(8deg) rotateY(4deg) translateZ(10px); }
  }
  @keyframes shareButtonFadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 0.04; }
    50% { opacity: 0.09; }
  }
  @keyframes snowfall {
    0% { transform: translateY(-10px) translateX(0) rotate(0deg); }
    25% { transform: translateY(25vh) translateX(15px) rotate(90deg); }
    50% { transform: translateY(50vh) translateX(-10px) rotate(180deg); }
    75% { transform: translateY(75vh) translateX(20px) rotate(270deg); }
    100% { transform: translateY(100vh) translateX(5px) rotate(360deg); }
  }
  @keyframes raindrop {
    0% { transform: translateY(-5px); opacity: 0.06; }
    50% { opacity: 0.1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes columnRise {
    0%, 100% { transform: perspective(800px) rotateX(2deg) scaleY(1); }
    50% { transform: perspective(800px) rotateX(-1deg) scaleY(1.02); }
  }
`;

// Inject global styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = globalCSS;
  document.head.appendChild(styleSheet);
}

// ═══ QUOTES DATABASE ═══
const Q = [
  // ── МАЯКОВСКИЙ (m) ──
  {t:"Но поэзия — пресволочнейшая штуковина: существует — и ни в зуб ногой.",p:"m",s:"Юбилейное"},
  {t:"Ненавижу всяческую мертвечину! Обожаю всяческую жизнь!",p:"m",s:"Юбилейное"},
  {t:"Я хочу быть понят моей страной, а не буду понят — что ж, по родной стране пройду стороной, как проходит косой дождь.",p:"m",s:"Домой!"},
  {t:"В этой жизни помереть нетрудно — сделать жизнь значительно трудней.",p:"m",s:"Сергею Есенину"},
  {t:"Поэзия — вся! — езда в незнаемое.",p:"m",s:"Разговор с фининспектором"},
  {t:"Вот и жизнь пройдет, как прошли Азорские острова.",p:"m",s:"Мелкая философия"},
  {t:"Для веселия планета наша мало оборудована. Надо вырвать радость у грядущих дней.",p:"m",s:"Сергею Есенину"},
  {t:"Тот, кто постоянно ясен, тот, по-моему, просто глуп.",p:"m",s:"Домой!"},
  {t:"Поэзия — та же добыча радия. В грамм добыча, в год труды.",p:"m",s:"Разговор с фининспектором"},
  {t:"Я люблю вас, но живого, а не мумию.",p:"m",s:"Юбилейное"},
  {t:"Слово — полководец человечьей силы.",p:"m",s:"Разговор с фининспектором"},
  {t:"У меня, да и у вас, в запасе вечность. Что нам потерять часок-другой?!",p:"m",s:"Юбилейное"},
  {t:"Светить всегда, светить везде, до дней последних донца, светить — и никаких гвоздей!",p:"m",s:"Необычайное приключение"},
  {t:"Послушайте! Ведь, если звезды зажигают — значит — это кому-нибудь нужно?",p:"m",s:"Послушайте!"},
  {t:"Я знаю — город будет, я знаю — саду цвесть, когда такие люди в стране советской есть!",p:"m",s:"Рассказ о Кузнецкстрое"},
  {t:"Грубым дается радость, нежным дается печаль.",p:"m",s:"Хорошее отношение к лошадям"},
  {t:"Все мы немножко лошади, каждый из нас по-своему лошадь.",p:"m",s:"Хорошее отношение к лошадям"},
  {t:"Если я чего написал, если чего сказал — тому виной глаза-небеса, тому виной любимой глаза.",p:"m",s:"Лиличка!"},

  // ── ПУШКИН (p) ──
  {t:"Товарищ, верь: взойдет она, звезда пленительного счастья.",p:"p",s:"К Чаадаеву"},
  {t:"Пока свободою горим, пока сердца для чести живы, мой друг, отчизне посвятим души прекрасные порывы!",p:"p",s:"К Чаадаеву"},
  {t:"Блажен, кто знает сладострастье высоких мыслей и стихов!",p:"p",s:"Жуковскому"},
  {t:"Владыки! Вам венец и трон дает Закон — а не природа; стоите выше вы народа, но вечный выше вас Закон.",p:"p",s:"Вольность"},
  {t:"Его стихов пленительная сладость пройдет веков завистливую даль.",p:"p",s:"К портрету Жуковского"},
  {t:"Давайте пить и веселиться, давайте жизнию играть.",p:"p",s:"Добрый совет"},
  {t:"Любовь и тайная свобода внушали сердцу гимн простой.",p:"p",s:"К Н. Я. Плюсковой"},
  {t:"И неподкупный голос мой был эхо русского народа.",p:"p",s:"К Н. Я. Плюсковой"},
  {t:"Россия вспрянет ото сна, и на обломках самовластья напишут наши имена!",p:"p",s:"К Чаадаеву"},
  {t:"Кто раз любил, уж не полюбит вновь; кто счастье знал, уж не узнает счастья.",p:"p",s:"К ***"},
  {t:"Я вас любил: любовь ещё, быть может, в душе моей угасла не совсем.",p:"p",s:"Я вас любил"},
  {t:"Я памятник себе воздвиг нерукотворный, к нему не зарастет народная тропа.",p:"p",s:"Памятник"},
  {t:"На свете счастья нет, но есть покой и воля.",p:"p",s:"Пора, мой друг, пора!"},
  {t:"Мечты, мечты, где ваша сладость? Где, вечная к ней рифма, младость?",p:"p",s:"Евгений Онегин"},
  {t:"Я жить хочу, чтоб мыслить и страдать.",p:"p",s:"Элегия"},
  {t:"Привычка свыше нам дана: замена счастию она.",p:"p",s:"Евгений Онегин"},
  {t:"Чем меньше женщину мы любим, тем легче нравимся мы ей.",p:"p",s:"Евгений Онегин"},
  {t:"Унылая пора! очей очарованье! Приятна мне твоя прощальная краса.",p:"p",s:"Осень"},

  // ── БРОДСКИЙ (b) ──
  {t:"Каждый пред Богом наг. Жалок, наг и убог.",p:"b",s:"Стихи под эпиграфом"},
  {t:"В каждой музыке Бах, в каждом из нас Бог.",p:"b",s:"Стихи под эпиграфом"},
  {t:"Переживи всех. Переживи вновь, словно они — снег, пляшущий снег снов.",p:"b",s:"Сонет"},
  {t:"Что из того, что мы не победили, что из того, что не вернулись мы?..",p:"b",s:"И вечный бой..."},
  {t:"А мы хотели просто уцелеть.",p:"b",s:"И вечный бой..."},
  {t:"Смерть — это только равнины. Жизнь — холмы, холмы.",p:"b",s:"Холмы"},
  {t:"С каждым днем я прожитым дышу уверенней и сладостней и чище.",p:"b",s:"Как Улисс"},
  {t:"Да будет мужественен твой путь, да будет он прям и прост.",p:"b",s:"Прощай, позабудь..."},
  {t:"Служи свое, опальная душа, короткие дела не совершая.",p:"b",s:"Зачем опять..."},
  {t:"От нынешней до будущей любви живи добрей, страдай неприхотливей.",p:"b",s:"Как Улисс"},
  {t:"Не выходи из комнаты, не совершай ошибку.",p:"b",s:"Не выходи из комнаты"},
  {t:"Ни страны, ни погоста не хочу выбирать. На Васильевский остров я приду умирать.",p:"b",s:"Стансы"},
  {t:"Пока есть такой язык, как русский, поэзия неизбежна.",p:"b",s:"Нобелевская лекция"},
  {t:"Мир, вероятно, спасти уже не удастся, но отдельного человека — всегда можно.",p:"b",s:"Речь в стадионе"},
  {t:"Человек есть конец самого себя и вдается во Время.",p:"b",s:"Колыбельная Трескового мыса"},
  {t:"Время больше пространства. Пространство — вещь. Время же, в сущности, мысль о вещи.",p:"b",s:"Колыбельная Трескового мыса"},
  {t:"Но пока мне рот не забили глиной, из него раздаваться будет лишь благодарность.",p:"b",s:"Я входил вместо дикого зверя в клетку"},
  {t:"Я входил вместо дикого зверя в клетку, выжигал свой срок и кликуху гвоздем в бараке.",p:"b",s:"Я входил вместо дикого зверя в клетку"},

  // ── ЕСЕНИН (e) ──
  {t:"Если крикнет рать святая: «Кинь ты Русь, живи в раю!» Я скажу: «Не надо рая, дайте родину мою».",p:"e",s:"Гой ты, Русь, моя родная"},
  {t:"Кого жалеть? Ведь каждый в мире странник — пройдет, зайдет и вновь оставит дом.",p:"e",s:"Отговорила роща золотая"},
  {t:"Быть поэтом — это значит то же, если правды жизни не нарушить, рубцевать себя по нежной коже, кровью чувств ласкать чужие души.",p:"e",s:"Быть поэтом"},
  {t:"Спит ковыль. Равнина дорогая, и свинцовой свежести полынь. Никакая родина другая не вольет мне в грудь мою теплынь.",p:"e",s:"Спит ковыль"},
  {t:"Грустная песня, ты — русская боль.",p:"e",s:"Чёрная, потом пропахшая выть!"},
  {t:"Не бродить, не мять в кустах багряных лебеды и не искать следа.",p:"e",s:"Не бродить, не мять..."},
  {t:"Я молюсь на алы зори, причащаюсь у ручья.",p:"e",s:"Я пастух"},
  {t:"Край ты мой заброшенный, край ты мой, пустырь. Сенокос некошеный, лес да монастырь.",p:"e",s:"Край ты мой заброшенный"},
  {t:"Пахнет яблоком и медом по церквам твой кроткий Спас.",p:"e",s:"Гой ты, Русь, моя родная"},
  {t:"Я покинул родимый дом, голубую оставил Русь.",p:"e",s:"Я покинул родимый дом"},
  {t:"Не жалею, не зову, не плачу, все пройдет, как с белых яблонь дым.",p:"e",s:"Не жалею, не зову, не плачу"},
  {t:"Мы теперь уходим понемногу в ту страну, где тишь и благодать.",p:"e",s:"Мы теперь уходим понемногу"},
  {t:"Лицом к лицу лица не увидать. Большое видится на расстоянье.",p:"e",s:"Письмо к женщине"},
  {t:"Поет зима — аукает, мохнатый лес баюкает стозвоном сосняка.",p:"e",s:"Поет зима — аукает"},
  {t:"Вот уж вечер. Роса блестит на крапиве. Я стою у дороги, прислонившись к иве.",p:"e",s:"Вот уж вечер"},
  {t:"Если б не было ада и рая, их бы выдумал сам человек.",p:"e",s:"Цветы"},
  {t:"Жизнь — обман с чарующей тоскою.",p:"e",s:"Жизнь — обман"},
  {t:"Счастлив тем, что целовал я женщин, мял цветы, валялся на траве.",p:"e",s:"Мы теперь уходим понемногу"},

  // ── ТЮТЧЕВ (t) ──
  {t:"Нам не дано предугадать, как слово наше отзовется, — и нам сочувствие дается, как нам дается благодать.",p:"t",s:"Нам не дано предугадать"},
  {t:"День пережит — и слава Богу!",p:"t",s:"Не рассуждай, не хлопочи"},
  {t:"Есть в осени первоначальной короткая, но дивная пора — прозрачный воздух, день хрустальный, и лучезарны вечера...",p:"t",s:"Есть в осени первоначальной"},
  {t:"О, как убийственно мы любим, как в буйной слепоте страстей мы то всего вернее губим, что сердцу нашему милей!",p:"t",s:"О, как убийственно мы любим"},
  {t:"Чему бы жизнь нас ни учила, но сердце верит в чудеса.",p:"t",s:"Чему бы жизнь нас ни учила"},
  {t:"Как души смотрят с высоты на ими брошенное тело...",p:"t",s:"Она сидела на полу"},
  {t:"Две силы есть — две роковые силы: одна есть Смерть, другая — Суд людской.",p:"t",s:"Две силы есть"},
  {t:"Не рассуждай, не хлопочи!.. Безумство ищет, глупость судит.",p:"t",s:"Не рассуждай, не хлопочи"},
  {t:"Пошли, Господь, свою отраду тому, кто в летний жар и зной, как бедный нищий, мимо саду, бредет по жесткой мостовой.",p:"t",s:"Пошли, Господь, свою отраду"},
  {t:"Блажен, кто посетил сей мир в его минуты роковые!",p:"t",s:"Цицерон"},
  {t:"Умом Россию не понять, аршином общим не измерить: у ней особенная стать — в Россию можно только верить.",p:"t",s:"Умом Россию не понять"},
  {t:"Мысль изреченная есть ложь.",p:"t",s:"Silentium!"},
  {t:"Молчи, скрывайся и таи и чувства и мечты свои.",p:"t",s:"Silentium!"},
  {t:"Природа — сфинкс. И тем она верней своим искусом губит человека, что, может статься, никакой от века загадки нет и не было у ней.",p:"t",s:"Природа — сфинкс"},
  {t:"Кончен пир, умолкли хоры, опорожнены амфоры, опрокинуты корзины...",p:"t",s:"Кончен пир, умолкли хоры"},
  {t:"Душа моя — Элизиум теней, теней безмолвных, светлых и прекрасных.",p:"t",s:"Душа моя — Элизиум теней"},
  {t:"Люблю грозу в начале мая, когда весенний, первый гром, как бы резвяся и играя, грохочет в небе голубом.",p:"t",s:"Весенняя гроза"},
  {t:"О, вещая душа моя! О, сердце, полное тревоги, о, как ты бьешься на пороге как бы двойного бытия!",p:"t",s:"О, вещая душа моя!"},

  // ── МАНДЕЛЬШТАМ (md) ──
  {t:"Мы живем, под собою не чуя страны, наши речи за десять шагов не слышны.",p:"md",s:"Мы живем, под собою не чуя страны"},
  {t:"За гремучую доблесть грядущих веков, за высокое племя людей я лишился и чаши на пире отцов, и веселья, и чести своей.",p:"md",s:"За гремучую доблесть грядущих веков"},
  {t:"Бессонница. Гомер. Тугие паруса. Я список кораблей прочел до середины.",p:"md",s:"Бессонница. Гомер. Тугие паруса"},
  {t:"Дано мне тело — что мне делать с ним, таким единым и таким моим?",p:"md",s:"Дано мне тело"},
  {t:"Я вернулся в мой город, знакомый до слез, до прожилок, до детских припухлых желез.",p:"md",s:"Ленинград"},
  {t:"Петербург! я еще не хочу умирать: у тебя телефонов моих номера.",p:"md",s:"Ленинград"},
  {t:"Звук осторожный и глухой плода, сорвавшегося с древа, среди немолчного напева глубокой тишины лесной...",p:"md",s:"Звук осторожный и глухой"},
  {t:"Золотистого меда струя из бутылки текла так тягуче и долго, что молвить хозяйка успела...",p:"md",s:"Золотистого меда струя"},
  {t:"Сестры — тяжесть и нежность — одинаковы ваши приметы.",p:"md",s:"Сестры — тяжесть и нежность"},
  {t:"Я слово позабыл, что я хотел сказать. Слепая ласточка в чертог теней вернется.",p:"md",s:"Ласточка"},
  {t:"Невыразимая печаль открыла два огромных глаза.",p:"md",s:"Невыразимая печаль"},
  {t:"Нет, не луна, а светлый циферблат сияет мне, — и чем я виноват, что слабых звезд я осязаю млечность?",p:"md",s:"Нет, не луна"},
  {t:"Век мой, зверь мой, кто сумеет заглянуть в твои зрачки и своею кровью склеит двух столетий позвонки?",p:"md",s:"Век"},
  {t:"Я изучил науку расставанья в простоволосых жалобах ночных.",p:"md",s:"Tristia"},
  {t:"На страшной высоте блуждающий огонь! Но разве так звезда мерцает?",p:"md",s:"На страшной высоте"},
  {t:"И Шуберт на воде, и Моцарт в птичьем гаме, и Гете, свищущий на вьющейся тропе.",p:"md",s:"И Шуберт на воде"},
  {t:"Возьми на радость из моих ладоней немного солнца и немного меду.",p:"md",s:"Возьми на радость"},
  {t:"Я наравне с другими хочу тебе служить, от ревности сухими губами ворожить.",p:"md",s:"Мастерица виноватых взоров"},

  // ── ЦВЕТАЕВА (ts) ──
  {t:"Моим стихам, написанным так рано, что и не знала я, что я — поэт, настанет свой черед.",p:"ts",s:"Моим стихам, написанным так рано"},
  {t:"Мне нравится, что вы больны не мной, мне нравится, что я больна не вами.",p:"ts",s:"Мне нравится, что вы больны не мной"},
  {t:"Я тебя отвоюю у всех земель, у всех небес!",p:"ts",s:"Я тебя отвоюю"},
  {t:"Уж сколько их упало в эту бездну, разверзтую вдали! Настанет день, когда и я исчезну с поверхности земли.",p:"ts",s:"Уж сколько их упало в эту бездну"},
  {t:"Рас-стояние: версты, мили... Нас рас-ставили, рас-садили.",p:"ts",s:"Рас-стояние"},
  {t:"Какой-нибудь предок мой был — скрипач, наездник и вор при этом.",p:"ts",s:"Какой-нибудь предок мой был"},
  {t:"Вчера еще в глаза глядел, а нынче — все косится в сторону! Вчера еще до птиц сидел, — все жаворонки нынче — вороны!",p:"ts",s:"Вчера еще в глаза глядел"},
  {t:"Идешь, на меня похожий, глаза устремляя вниз. Я их опускала — тоже! Прохожий, остановись!",p:"ts",s:"Идешь, на меня похожий"},
  {t:"Тоска по родине! Давно разоблаченная морока! Мне совершенно все равно — где совершенно одинокой быть.",p:"ts",s:"Тоска по родине"},
  {t:"Кто создан из камня, кто создан из глины, — а я серебрюсь и сверкаю!",p:"ts",s:"Кто создан из камня"},
  {t:"Что же мне делать, слепцу и пасынку, в мире, где каждый и отч и зряч.",p:"ts",s:"Что же мне делать"},
  {t:"Мой милый, что тебе я сделала? Что тебе я сделала? — Жила.",p:"ts",s:"Мой милый, что тебе я сделала"},
  {t:"Никто ничего не отнял — мне сладостно, что мы врозь!",p:"ts",s:"Никто ничего не отнял"},
  {t:"Пригвождена к позорному столбу славянской совести старинной, с змеею в сердце и с клеймом на лбу, я утверждаю, что — невинна.",p:"ts",s:"Пригвождена к позорному столбу"},
  {t:"Я — страница твоему перу. Все приму. Я белая страница.",p:"ts",s:"Я — страница твоему перу"},
  {t:"Имя твое — птица в руке, имя твое — льдинка на языке.",p:"ts",s:"Стихи к Блоку"},
  {t:"Не самозванка — я пришла домой, и не служанка — мне не надо хлеба.",p:"ts",s:"Не самозванка — я пришла домой"},
  {t:"Вскрыла жилы: неостановимо, невосстановимо хлещет жизнь.",p:"ts",s:"Вскрыла жилы"},

  // ── БЛОК (bl) ──
  {t:"Ночь, улица, фонарь, аптека, бессмысленный и тусклый свет.",p:"bl",s:"Ночь, улица, фонарь, аптека"},
  {t:"И вечный бой! Покой нам только снится сквозь кровь и пыль...",p:"bl",s:"На поле Куликовом"},
  {t:"О, весна без конца и без краю — без конца и без краю мечта!",p:"bl",s:"О, весна без конца и без краю"},
  {t:"О, я хочу безумно жить: все сущее — увековечить, безличное — вочеловечить, несбывшееся — воплотить!",p:"bl",s:"О, я хочу безумно жить"},
  {t:"Узнаю тебя, жизнь! Принимаю! И приветствую звоном щита!",p:"bl",s:"О, весна без конца и без краю"},
  {t:"Я послал тебе черную розу в бокале золотого, как небо, Аи.",p:"bl",s:"В ресторане"},
  {t:"Россия, нищая Россия, мне избы серые твои, твои мне песни ветровые — как слезы первые любви!",p:"bl",s:"Россия"},
  {t:"Предчувствую Тебя. Года проходят мимо — все в облике одном предчувствую Тебя.",p:"bl",s:"Стихи о Прекрасной Даме"},
  {t:"Девушка пела в церковном хоре о всех усталых в чужом краю, о всех кораблях, ушедших в море, о всех, забывших радость свою.",p:"bl",s:"Девушка пела в церковном хоре"},
  {t:"Рожденные в года глухие пути не помнят своего. Мы — дети страшных лет России — забыть не в силах ничего.",p:"bl",s:"Рожденные в года глухие"},
  {t:"Есть немота — то гул набата заставил заградить уста.",p:"bl",s:"Рожденные в года глухие"},
  {t:"И невозможное возможно, дорога долгая легка, когда блеснет в дали дорожной мгновенный взор из-под платка.",p:"bl",s:"Россия"},
  {t:"Вхожу я в темные храмы, совершаю бедный обряд.",p:"bl",s:"Стихи о Прекрасной Даме"},
  {t:"Она пришла с мороза, раскрасневшаяся, наполнила комнату ароматом воздуха и духов.",p:"bl",s:"Она пришла с мороза"},
  {t:"Принимаю пустынные веси! И колодцы земных городов!",p:"bl",s:"О, весна без конца и без краю"},
  {t:"Было то в темных аллеях, сердце билось: «Скорей, скорей!»",p:"bl",s:"В ресторане"},
  {t:"Есть в напевах твоих сокровенных роковая о гибели весть.",p:"bl",s:"К Музе"},

  // ── ПАСТЕРНАК (pa) ──
  {t:"Февраль. Достать чернил и плакать! Писать о феврале навзрыд.",p:"pa",s:"Февраль. Достать чернил и плакать!"},
  {t:"Во всем мне хочется дойти до самой сути.",p:"pa",s:"Во всем мне хочется дойти"},
  {t:"Но пораженье от победы ты сам не должен отличать.",p:"pa",s:"Быть знаменитым некрасиво"},
  {t:"Быть знаменитым некрасиво. Не это подымает ввысь.",p:"pa",s:"Быть знаменитым некрасиво"},
  {t:"Цель творчества — самоотдача, а не шумиха, не успех. Позорно, ничего не знача, быть притчей на устах у всех.",p:"pa",s:"Быть знаменитым некрасиво"},
  {t:"Свеча горела на столе, свеча горела.",p:"pa",s:"Зимняя ночь"},
  {t:"Мело, мело по всей земле во все пределы.",p:"pa",s:"Зимняя ночь"},
  {t:"Не спи, не спи, художник, не предавайся сну. Ты — вечности заложник у времени в плену.",p:"pa",s:"Ночь"},
  {t:"Я кончился, а ты жива. И ветер, жалуясь и плача, раскачивает лес и дачу.",p:"pa",s:"Ветер"},
  {t:"Когда разгуляется, на дне души моей, как жемчуг на дне морском, отстаивается строка.",p:"pa",s:"Когда разгуляется"},
  {t:"Жизнь ведь тоже только миг, только растворенье нас самих во всех других, как бы им в даренье.",p:"pa",s:"Единственные дни"},
  {t:"Гул затих. Я вышел на подмостки. Прислонясь к дверному косяку, я ловлю в далеком отголоске, что случится на моем веку.",p:"pa",s:"Гамлет"},
  {t:"И чем случайней, тем вернее слагаются стихи навзрыд.",p:"pa",s:"Февраль. Достать чернил и плакать!"},
  {t:"Никого не будет в доме, кроме сумерек. Один зимний день в сквозном проеме незадернутых гардин.",p:"pa",s:"Никого не будет в доме"},
  {t:"Любить иных — тяжелый крест, а ты прекрасна без извилин.",p:"pa",s:"Любить иных — тяжелый крест"},
  {t:"Рассвет расколыхнет свечу, зажжет и пустит в цель стрижа.",p:"pa",s:"Определение поэзии"},
  {t:"Я весь мир заставил плакать над красой земли моей.",p:"pa",s:"Нобелевская премия"},
  {t:"Верю я, придет пора — силу подлости и злобы одолеет дух добра.",p:"pa",s:"Нобелевская премия"},
];

// ═══ POET CONFIGS ═══
const PC = {
  m:{l:"В. В. Маяковский",tf:"'Dela Gothic One',sans-serif",qf:"'Playfair Display',serif",mf:"'Dela Gothic One',sans-serif",qs:"italic",qw:400,sz:"clamp(1.2rem,3.2vw,1.8rem)",lh:1.6,ls:"0.01em",
    pl:[{bg:"#D42B2B",a:"#FFD600",t:"#FFF"},{bg:"#1A1A2E",a:"#E94560",t:"#EAEAEA"},{bg:"#0D1117",a:"#FF6B35",t:"#F0E6D3"},{bg:"#2D1B4E",a:"#F2C744",t:"#F5F0E8"},{bg:"#1C1C1C",a:"#D42B2B",t:"#F5F5F0"}]},
  p:{l:"А. С. Пушкин",tf:"'Playfair Display',serif",qf:"'Cormorant Garamond',serif",mf:"'Cormorant Garamond',serif",qs:"normal",qw:400,sz:"clamp(1.15rem,2.8vw,1.65rem)",lh:1.85,ls:"0.02em",
    pl:[{bg:"#1B2A1B",a:"#D4A843",t:"#F5F0E0"},{bg:"#2C1810",a:"#C9956B",t:"#F5EDE3"},{bg:"#1E1E2E",a:"#C8AA6E",t:"#F0EBE0"},{bg:"#252015",a:"#D4A843",t:"#F5F0E0"}]},
  b:{l:"И. А. Бродский",tf:"'IBM Plex Mono',monospace",qf:"'IBM Plex Mono',monospace",mf:"'IBM Plex Mono',monospace",qs:"normal",qw:300,sz:"clamp(0.95rem,2.4vw,1.35rem)",lh:1.95,ls:"0.03em",
    pl:[{bg:"#0C0C14",a:"#6A7B99",t:"#C8CCD8"},{bg:"#10141C",a:"#7888A0",t:"#BCC4D4"},{bg:"#0E0E18",a:"#5C6E8A",t:"#B8C0D0"},{bg:"#12121E",a:"#8090A8",t:"#C4CCD8"}]},
  e:{l:"С. А. Есенин",tf:"'Lora',serif",qf:"'Lora',serif",mf:"'Cormorant Garamond',serif",qs:"italic",qw:400,sz:"clamp(1.1rem,2.8vw,1.55rem)",lh:1.8,ls:"0.015em",
    pl:[{bg:"#1E1A10",a:"#C8A96E",t:"#F0E8D4"},{bg:"#1A2E1A",a:"#A4BE7B",t:"#ECF0DC"},{bg:"#2E2418",a:"#D4A843",t:"#F5EDE0"},{bg:"#1C2820",a:"#B5A67D",t:"#EDE8DA"}]},
  t:{l:"Ф. И. Тютчев",tf:"'Cormorant Garamond',serif",qf:"'Cormorant Garamond',serif",mf:"'Cormorant Garamond',serif",qs:"normal",qw:300,sz:"clamp(1.15rem,3vw,1.65rem)",lh:1.85,ls:"0.025em",
    pl:[{bg:"#06080F",a:"#4A6A9D",t:"#C8D4E8"},{bg:"#08060F",a:"#6A5A9D",t:"#D0C8E8"},{bg:"#060A10",a:"#4A7A8D",t:"#C8DCE8"},{bg:"#0A0810",a:"#5A6AAD",t:"#CCD0E8"}]},
  // ── NEW POETS ──
  md:{l:"О. Э. Мандельштам",tf:"'Playfair Display',serif",qf:"'Cormorant Garamond',serif",mf:"'Playfair Display',serif",qs:"normal",qw:400,sz:"clamp(1.1rem,2.8vw,1.55rem)",lh:1.8,ls:"0.02em",
    pl:[{bg:"#16130E",a:"#C4A265",t:"#E8DCC8"},{bg:"#0E1018",a:"#8A7A5A",t:"#D8D0BC"},{bg:"#141210",a:"#B89858",t:"#E4D8C0"},{bg:"#100C14",a:"#9A8A68",t:"#DCD4C0"}]},
  ts:{l:"М. И. Цветаева",tf:"'Playfair Display',serif",qf:"'Playfair Display',serif",mf:"'Cormorant Garamond',serif",qs:"italic",qw:400,sz:"clamp(1.1rem,2.8vw,1.55rem)",lh:1.75,ls:"0.015em",
    pl:[{bg:"#200A10",a:"#D44A4A",t:"#F0D8D8"},{bg:"#1A0A18",a:"#C44488",t:"#E8D0E0"},{bg:"#180810",a:"#E85050",t:"#F4E0D8"},{bg:"#1C0E14",a:"#B83868",t:"#E4D0D8"}]},
  bl:{l:"А. А. Блок",tf:"'Cormorant Garamond',serif",qf:"'Cormorant Garamond',serif",mf:"'Cormorant Garamond',serif",qs:"italic",qw:300,sz:"clamp(1.1rem,2.8vw,1.6rem)",lh:1.85,ls:"0.025em",
    pl:[{bg:"#080A14",a:"#5A6A90",t:"#C0C8E0"},{bg:"#0A0810",a:"#6A5A88",t:"#CCC4E0"},{bg:"#060810",a:"#4A5A80",t:"#B8C4D8"},{bg:"#0C0A14",a:"#7A6A98",t:"#D0C8E4"}]},
  pa:{l:"Б. Л. Пастернак",tf:"'Lora',serif",qf:"'Lora',serif",mf:"'Cormorant Garamond',serif",qs:"normal",qw:400,sz:"clamp(1.1rem,2.8vw,1.55rem)",lh:1.8,ls:"0.02em",
    pl:[{bg:"#0E1410",a:"#6A9A5A",t:"#D4E8CC"},{bg:"#101418",a:"#5A8A70",t:"#C8E0D4"},{bg:"#0C1210",a:"#7AAA60",t:"#D8ECCC"},{bg:"#0E1014",a:"#5A8A88",t:"#C8DCD8"}]},
};

// ═══ CANVAS IMAGE GENERATION ═══
// ═══ CANVAS IMAGE GENERATION (1080x1920 for Stories) ═══
function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line.trim());
  return lines;
}

function generateShareImage(quote, poet, palette) {
  const W = 1080, H = 1920; // 9:16 stories format
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle gradient overlay
  const grad = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.4, H*0.6);
  grad.addColorStop(0, palette.a + "0A");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative line top
  ctx.strokeStyle = palette.a;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W*0.3, 280);
  ctx.lineTo(W*0.7, 280);
  ctx.stroke();

  // Poet name
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = palette.a;
  ctx.font = "500 36px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(poet.l, W/2, 340);

  // Decorative line below name
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.moveTo(W*0.3, 400);
  ctx.lineTo(W*0.7, 400);
  ctx.stroke();

  // Quote text — centered vertically in the middle zone
  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.t;
  const fontSize = quote.t.length > 120 ? 38 : quote.t.length > 80 ? 42 : 48;
  const lineH = fontSize * 1.65;
  ctx.font = `400 ${fontSize}px 'Georgia', serif`;
  const maxW = W - 160; // 80px padding each side
  const lines = wrapLines(ctx, quote.t, maxW);

  // Center the text block vertically in the middle area (480–1400)
  const textBlockH = lines.length * lineH;
  const midZoneTop = 480;
  const midZoneBot = 1400;
  const startY = midZoneTop + (midZoneBot - midZoneTop - textBlockH) / 2 + fontSize * 0.5;

  lines.forEach((l, i) => {
    ctx.fillText(l, W/2, startY + i * lineH);
  });

  // Source
  ctx.fillStyle = palette.a;
  ctx.globalAlpha = 0.5;
  ctx.font = "italic 26px 'Georgia', serif";
  const sourceY = Math.max(startY + lines.length * lineH + 80, 1440);
  ctx.fillText(`— ${quote.s}`, W/2, sourceY);

  // Decorative dot
  ctx.globalAlpha = 0.12;
  ctx.font = "20px serif";
  ctx.fillText("\u2022", W/2, sourceY + 60);

  // Watermark at bottom
  ctx.fillStyle = palette.a;
  ctx.globalAlpha = 0.25;
  ctx.font = "18px monospace";
  ctx.fillText("1 bar, pls by sergei tislenko", W/2, H - 80);

  // Small branding line
  ctx.globalAlpha = 0.12;
  ctx.font = "italic 20px 'Georgia', serif";
  ctx.fillText("строчку, будьте добры", W/2, H - 44);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

// ═══ SHARE PANEL COMPONENT ═══
function SharePanel({ quote, poet, palette }) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = useCallback(async () => {
    const blob = await generateShareImage(quote, poet, palette);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `strokhu-${dateStr}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [quote, poet, palette]);

  const handleWebShare = useCallback(async () => {
    if (!navigator.share) return;
    const blob = await generateShareImage(quote, poet, palette);
    const file = new File([blob], 'strokhu.png', { type: 'image/png' });
    // Check if device supports file sharing
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
      } catch (err) {
        if (err.name !== 'AbortError') console.log('Share error:', err);
      }
    } else {
      // Fallback: download if canShare not supported
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'strokhu.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [quote, poet, palette]);

  const hasWebShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div style={{
      position: "absolute",
      bottom: 80,
      right: 32,
      display: "flex",
      gap: 12,
      flexDirection: "column-reverse",
      zIndex: 20,
    }}>
      {showButtons && (
        <>
          {hasWebShare && (
            <button
              onClick={handleWebShare}
              title="Share"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "none",
                border: `2px solid ${palette.a}`,
                color: palette.a,
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.4,
                transition: "all 0.3s",
                animation: "shareButtonFadeIn 0.4s ease-out",
              }}
              onMouseEnter={e => e.target.style.opacity = 0.8}
              onMouseLeave={e => e.target.style.opacity = 0.4}
            >
              {"\u21E7"}
            </button>
          )}
          <button
            onClick={handleDownload}
            title="Download"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "none",
              border: `2px solid ${palette.a}`,
              color: palette.a,
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.4,
              transition: "all 0.3s",
              animation: "shareButtonFadeIn 0.2s ease-out",
            }}
            onMouseEnter={e => e.target.style.opacity = 0.8}
            onMouseLeave={e => e.target.style.opacity = 0.4}
          >
            {"\u2913"}
          </button>
        </>
      )}
    </div>
  );
}

// ═══ DECORATIONS ═══

// --- МАЯКОВСКИЙ: конструктивизм, лесенка, плакат, геометрия + 3D CUBES ---
function MayaD({a}){
  const shapes = useMemo(()=>Array.from({length:8},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*40+15, rot:Math.random()*360,
    type:Math.floor(Math.random()*3),
    op:Math.random()*0.06+0.02, dur:Math.random()*30+20, del:Math.random()*5,
  })),[]);
  const stairs = useMemo(()=>Array.from({length:5},(_,i)=>({
    y:15+i*16, w:20+Math.random()*30, fromRight:Math.random()>0.5,
  })),[]);
  const slashes = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:Math.random()*80+10,
    len:Math.random()*120+60, rot:-35+Math.random()*20,
    op:Math.random()*0.06+0.03,
  })),[]);
  const cube3d = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:Math.random()*80+10,
    sz:Math.random()*30+30, op:Math.random()*0.07+0.04,
    dur:Math.random()*40+30, axis:Math.random()>0.5?"x":"y",
  })),[]);
  const plane3d = useMemo(()=>({
    x:Math.random()>0.5?5:85, y:Math.random()*60+15,
    w:220, h:140, op:Math.random()*0.06+0.03,
  }),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:16,left:16,width:36,height:36,opacity:0.2,borderTop:"3px solid "+a,borderLeft:"3px solid "+a}}/>
    <div style={{position:"absolute",top:16,right:16,width:36,height:36,opacity:0.2,borderTop:"3px solid "+a,borderRight:"3px solid "+a}}/>
    <div style={{position:"absolute",bottom:16,left:16,width:36,height:36,opacity:0.2,borderBottom:"3px solid "+a,borderLeft:"3px solid "+a}}/>
    <div style={{position:"absolute",bottom:16,right:16,width:36,height:36,opacity:0.2,borderBottom:"3px solid "+a,borderRight:"3px solid "+a}}/>
    {stairs.map((s,i)=><div key={"st"+i} style={{position:"absolute",top:s.y+"%",
      [s.fromRight?"right":"left"]:0, width:s.w+"%",height:3,background:a,opacity:0.04}}/>)}
    {slashes.map((s,i)=><div key={"sl"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",
      width:s.len,height:2,background:a,opacity:s.op,transform:"rotate("+s.rot+"deg)",transformOrigin:"left center"}}/>)}
    {shapes.map((s,i)=><div key={"sh"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",
      width:s.type===0?0:s.sz, height:s.type===0?0:s.type===2?s.sz:s.sz*0.6,
      borderLeft:s.type===0?s.sz/2+"px solid transparent":undefined,
      borderRight:s.type===0?s.sz/2+"px solid transparent":undefined,
      borderBottom:s.type===0?s.sz*0.8+"px solid "+a:undefined,
      background:s.type!==0?a:undefined,
      opacity:s.op, transform:"rotate("+s.rot+"deg)",
      animation:"drift "+s.dur+"s ease-in-out "+s.del+"s infinite",
    }}/>)}
    {cube3d.map((c,i)=><div key={"c3d"+i} style={{
      position:"absolute",left:c.x+"%",top:c.y+"%",width:c.sz,height:c.sz,perspective:"800px",
    }}>
      <div style={{width:"100%",height:"100%",opacity:c.op,animation:`spin3d ${c.dur}s linear infinite`,transformStyle:"preserve-3d"}}>
        <div style={{position:"absolute",inset:0,border:`1px solid ${a}`,transform:"translateZ("+c.sz/2+"px)"}}/>
        <div style={{position:"absolute",inset:0,border:`1px solid ${a}`,transform:"rotateY(180deg) translateZ("+c.sz/2+"px)"}}/>
        <div style={{position:"absolute",inset:0,border:`1px solid ${a}`,transform:"rotateY(90deg) translateZ("+c.sz/2+"px)"}}/>
        <div style={{position:"absolute",inset:0,border:`1px solid ${a}`,transform:"rotateY(-90deg) translateZ("+c.sz/2+"px)"}}/>
        <div style={{position:"absolute",inset:0,border:`1px solid ${a}`,transform:"rotateX(90deg) translateZ("+c.sz/2+"px)"}}/>
        <div style={{position:"absolute",inset:0,border:`1px solid ${a}`,transform:"rotateX(-90deg) translateZ("+c.sz/2+"px)"}}/>
      </div>
    </div>)}
    <div style={{position:"absolute",left:plane3d.x+"%",top:plane3d.y+"%",width:plane3d.w,height:plane3d.h,perspective:"900px",opacity:plane3d.op}}>
      <div style={{width:"100%",height:"100%",border:`2px solid ${a}`,transformStyle:"preserve-3d",animation:"float3d 8s ease-in-out infinite"}}/>
    </div>
    <div style={{position:"absolute",left:0,top:"25%",bottom:"25%",width:5,background:a,opacity:0.1}}/>
    {[0,1,2].map(i=><div key={"ex"+i} style={{position:"absolute",
      right:8+Math.random()*20+"%", top:10+i*30+Math.random()*10+"%",
      fontSize:Math.random()*20+14, fontFamily:"'Dela Gothic One',sans-serif",
      color:a, opacity:0.04+Math.random()*0.03, transform:"rotate("+(Math.random()*30-15)+"deg)",
    }}>!</div>)}
  </div>;
}

// --- ПУШКИН: перо, росчерки, классические орнаменты + 3D PAGES ---
function PushD({a}){
  const ornaments = useMemo(()=>{
    const syms = ["\u2766","\u2767","\u2619","\u2735","\u273B","\u2726","\u2727"];
    return Array.from({length:6},()=>({
      sym:syms[Math.floor(Math.random()*syms.length)],
      x:Math.random()*80+10, y:Math.random()*80+10,
      sz:Math.random()*14+10, op:Math.random()*0.06+0.03, rot:Math.random()*40-20,
    }));
  },[]);
  const quillStrokes = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()*70+15, y:Math.random()*70+15,
    w:Math.random()*80+40, curve:Math.random()*20-10, op:Math.random()*0.04+0.02,
  })),[]);
  const pages3d = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:Math.random()*70+10,
    w:80, h:120, op:Math.random()*0.05+0.03,
    rotX:Math.random()*20+10, rotY:Math.random()*20-10,
  })),[]);

  const r=<div style={{display:"flex",gap:24,opacity:0.08,color:a,fontSize:14,fontFamily:"serif"}}>
    <span>{"\u2666"}</span><span>{"\u2014"}</span><span>{"\u2735"}</span><span>{"\u2014"}</span><span>{"\u2666"}</span>
  </div>;
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:40,left:"50%",transform:"translateX(-50%)"}}>{r}</div>
    <div style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)"}}>{r}</div>
    <div style={{position:"absolute",left:24,top:"18%",bottom:"18%",width:1,background:"linear-gradient(transparent,"+a+"44,"+a+"44,transparent)"}}/>
    <div style={{position:"absolute",right:24,top:"18%",bottom:"18%",width:1,background:"linear-gradient(transparent,"+a+"44,"+a+"44,transparent)"}}/>
    {ornaments.map((o,i)=><div key={"orn"+i} style={{position:"absolute",left:o.x+"%",top:o.y+"%",
      fontSize:o.sz,color:a,opacity:o.op,fontFamily:"serif",
      transform:"rotate("+o.rot+"deg)",
      animation:"subtleBreathe "+(4+Math.random()*3)+"s ease-in-out "+(Math.random()*3)+"s infinite",
    }}>{o.sym}</div>)}
    {quillStrokes.map((s,i)=><svg key={"qs"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",overflow:"visible",opacity:s.op}}
      width={s.w} height="20">
      <path d={`M0,10 Q${s.w/2},${10+s.curve} ${s.w},10`} stroke={a} fill="none" strokeWidth="0.8"/>
    </svg>)}
    {pages3d.map((p,i)=><div key={"pg3d"+i} style={{
      position:"absolute",left:p.x+"%",top:p.y+"%",width:p.w,height:p.h,perspective:"700px",
    }}>
      <div style={{
        width:"100%",height:"100%",
        background:"rgba(245,240,224,"+p.op+")",
        border:`1px solid ${a}`,opacity:p.op*2,
        animation:"rock3d 6s ease-in-out infinite",
        transformStyle:"preserve-3d",
        transform:`perspective(700px) rotateX(${p.rotX}deg) rotateY(${p.rotY}deg)`,
      }}/>
    </div>)}
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
      width:"40vmin",height:"40vmin",borderRadius:"50%",
      background:"radial-gradient(circle,"+a+"06 0%,transparent 70%)"}}/>
  </div>;
}

// --- БРОДСКИЙ: пишущая машинка, нумерация строк, зачёркивания + 3D KEYS ---
function BrodD({a}){
  const lineNums = useMemo(()=>Array.from({length:12},(_,i)=>({
    y:8+i*7.5, num:Math.floor(Math.random()*200)+1, op:Math.random()*0.06+0.02,
  })),[]);
  const redactions = useMemo(()=>Array.from({length:3},()=>({
    x:15+Math.random()*60, y:Math.random()*80+10, w:Math.random()*60+30, op:Math.random()*0.04+0.02,
  })),[]);
  const footnotes = useMemo(()=>Array.from({length:2},(_,i)=>({
    x:Math.random()*60+20, y:75+i*10+Math.random()*5, mark:Math.floor(Math.random()*9)+1,
  })),[]);
  const typoChars = useMemo(()=>{
    const chars = "абвгдежзиклмнопрстуфхцчшщэюя".split("");
    return Array.from({length:5},()=>({
      ch:chars[Math.floor(Math.random()*chars.length)],
      x:Math.random()*90+5, y:Math.random()*90+5,
      op:Math.random()*0.03+0.01, sz:Math.random()*10+8,
    }));
  },[]);
  const keys3d = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()*80+10, y:Math.random()*70+10,
    sz:Math.random()*10+20, op:Math.random()*0.06+0.03, tilt:Math.random()*20-10,
  })),[]);
  const paper3d = useMemo(()=>({
    x:Math.random()>0.5?15:75, y:Math.random()*50+20,
    w:160, h:220, op:Math.random()*0.05+0.02,
  }),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {[20,30,40,50,60,70,80].map((y,i)=><div key={"rl"+i} style={{position:"absolute",left:"8%",right:"8%",top:y+"%",height:1,background:a,opacity:0.025}}/>)}
    <div style={{position:"absolute",left:"10%",top:"10%",bottom:"10%",width:1,background:a,opacity:0.06}}/>
    {lineNums.map((l,i)=><div key={"ln"+i} style={{position:"absolute",left:"5%",top:l.y+"%",
      fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:a,opacity:l.op,letterSpacing:1,
    }}>{String(l.num).padStart(3,"\u2007")}</div>)}
    {redactions.map((r,i)=><div key={"rd"+i} style={{position:"absolute",left:r.x+"%",top:r.y+"%",
      width:r.w,height:2,background:a,opacity:r.op}}/>)}
    {footnotes.map((f,i)=><div key={"fn"+i} style={{position:"absolute",left:f.x+"%",top:f.y+"%",
      fontFamily:"'IBM Plex Mono',monospace",fontSize:7,color:a,opacity:0.05,
    }}>{f.mark})</div>)}
    {typoChars.map((t,i)=><div key={"tc"+i} style={{position:"absolute",left:t.x+"%",top:t.y+"%",
      fontFamily:"'IBM Plex Mono',monospace",fontSize:t.sz,color:a,opacity:t.op,
    }}>{t.ch}</div>)}
    {keys3d.map((k,i)=><div key={"k3d"+i} style={{
      position:"absolute",left:k.x+"%",top:k.y+"%",width:k.sz,height:k.sz,opacity:k.op,perspective:"500px",
    }}>
      <div style={{
        width:"100%",height:"100%",background:a,
        border:`1px solid ${a}`,
        boxShadow:`0 4px 8px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2)`,
        transform:`perspective(600px) rotateX(-20deg) rotateY(${k.tilt}deg) translateZ(8px)`,
        transformStyle:"preserve-3d",animation:"float3d 7s ease-in-out infinite",
      }}/>
    </div>)}
    <div style={{
      position:"absolute",left:paper3d.x+"%",top:paper3d.y+"%",width:paper3d.w,height:paper3d.h,perspective:"800px",
    }}>
      <div style={{
        width:"100%",height:"100%",
        background:`rgba(245,240,224,${paper3d.op})`,
        border:`1px solid ${a}`,opacity:paper3d.op*2,
        animation:"rock3d 8s ease-in-out infinite",
        transform:"perspective(800px) rotateX(12deg) rotateY(25deg) rotateZ(-5deg)",
        transformStyle:"preserve-3d",
      }}/>
    </div>
    <div style={{position:"absolute",top:44,right:32,fontSize:10,opacity:0.08,color:a,fontFamily:"monospace",letterSpacing:4}}>* * *</div>
    <div style={{position:"absolute",bottom:"18%",right:"15%",width:8,height:2,background:a,opacity:0.1,
      animation:"twinkle 1s step-end infinite"}}/>
  </div>;
}

// --- ЕСЕНИН: берёзы, листья, колосья, природа + 3D LEAVES ---
function EsenD({a}){
  const leaves = useMemo(()=>Array.from({length:8},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*12+6, rot:Math.random()*360,
    op:Math.random()*0.06+0.02, dur:Math.random()*20+15, del:Math.random()*8,
    drift:Math.random()*60-30,
  })),[]);
  const birchMarks = useMemo(()=>Array.from({length:5},()=>({
    x:Math.random()>0.5 ? Math.random()*15 : 85+Math.random()*15,
    y:Math.random()*70+15, w:Math.random()*3+1, h:Math.random()*15+5, op:Math.random()*0.04+0.01,
  })),[]);
  const ripples = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:60+Math.random()*30,
    sz:Math.random()*80+40, op:Math.random()*0.03+0.01,
  })),[]);
  const tumbleLeaves = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*14+8, op:Math.random()*0.07+0.04, dur:Math.random()*25+18,
  })),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",
      width:"130vw",height:"130vh",borderRadius:"50%",
      background:"radial-gradient(ellipse,"+a+"0A 0%,transparent 60%)"}}/>
    <div style={{position:"absolute",bottom:"25%",left:"10%",right:"10%",height:1,
      background:"linear-gradient(90deg,transparent,"+a+"25,"+a+"30,"+a+"25,transparent)"}}/>
    {leaves.map((l,i)=><svg key={"lf"+i} style={{position:"absolute",left:l.x+"%",top:l.y+"%",
      opacity:l.op, animation:"leafFall "+l.dur+"s ease-in-out "+l.del+"s infinite",
      transform:"rotate("+l.rot+"deg)"}} width={l.sz} height={l.sz*1.4} viewBox="0 0 20 28">
      <path d="M10,0 Q18,10 10,28 Q2,10 10,0 Z" fill={a} opacity="0.6"/>
      <path d="M10,2 L10,24" stroke={a} strokeWidth="0.5" opacity="0.4"/>
    </svg>)}
    {birchMarks.map((b,i)=><div key={"bk"+i} style={{position:"absolute",left:b.x+"%",top:b.y+"%",
      width:b.w,height:b.h,background:a,opacity:b.op,borderRadius:1}}/>)}
    {ripples.map((r,i)=><div key={"rp"+i} style={{position:"absolute",left:r.x+"%",top:r.y+"%",
      width:r.sz,height:r.sz*0.3,borderRadius:"50%",
      border:"1px solid "+a,opacity:r.op,transform:"translateX(-50%)"}}/>)}
    {tumbleLeaves.map((tl,i)=><div key={"tl3d"+i} style={{
      position:"absolute",left:tl.x+"%",top:tl.y+"%",perspective:"600px",
    }}>
      <svg style={{opacity:tl.op,animation:`tumble3d ${tl.dur}s linear infinite`,transformStyle:"preserve-3d"}}
        width={tl.sz} height={tl.sz*1.4} viewBox="0 0 20 28">
        <path d="M10,0 Q18,10 10,28 Q2,10 10,0 Z" fill={a} opacity="0.6"/>
        <path d="M10,2 L10,24" stroke={a} strokeWidth="0.5" opacity="0.4"/>
      </svg>
    </div>)}
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",perspective:"1200px",overflow:"hidden"}}>
      <div style={{width:"100%",height:"100%",
        background:`linear-gradient(to bottom,transparent,${a}08)`,
        transform:"perspective(1200px) rotateX(60deg) scaleY(2)",
        transformOrigin:"bottom center",opacity:0.05,
      }}/>
    </div>
    <div style={{position:"absolute",bottom:"12%",right:"8%",fontSize:18,color:a,opacity:0.04,
      fontFamily:"serif",transform:"rotate(-10deg)"}}>{"~"}</div>
  </div>;
}

// --- ТЮТЧЕВ: космос, созвездия, лунные фазы, вечность + 3D ORBITS ---
function TyutD({a}){
  const stars=useMemo(()=>Array.from({length:50},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*1.8+0.4, op:Math.random()*0.2+0.03,
    dur:Math.random()*4+3, del:Math.random()*5,
  })),[]);
  const constellations=useMemo(()=>{
    const pts=Array.from({length:6},()=>({x:20+Math.random()*60,y:10+Math.random()*40}));
    const lines=[];
    for(let i=0;i<pts.length-1;i++){
      if(Math.random()>0.3) lines.push({x1:pts[i].x,y1:pts[i].y,x2:pts[i+1].x,y2:pts[i+1].y});
    }
    return lines;
  },[]);
  const moonPhase=useMemo(()=>Math.floor(Math.random()*4),[]);
  const nebulae=useMemo(()=>Array.from({length:2},()=>({
    x:Math.random()*80+10, y:Math.random()*60+10,
    sz:Math.random()*30+20, hue:Math.random()>0.5?"blue":"purple",
  })),[]);
  const ring3d = useMemo(()=>({cx:50, cy:40, rx:60, ry:20, op:Math.random()*0.08+0.04}),[]);
  const orbitDots = useMemo(()=>Array.from({length:5},()=>({
    idx:Math.floor(Math.random()*360/10), op:Math.random()*0.07+0.03,
  })),[]);
  const sphere3d = useMemo(()=>({cx:80, cy:70, r:35, op:Math.random()*0.06+0.03}),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:"20%",left:"60%",width:"50vw",height:"50vh",borderRadius:"50%",
      background:"radial-gradient(ellipse,"+a+"0A 0%,transparent 60%)",transform:"translate(-50%,-50%)"}}/>
    {nebulae.map((n,i)=><div key={"nb"+i} style={{position:"absolute",left:n.x+"%",top:n.y+"%",
      width:n.sz+"vmin",height:n.sz*0.6+"vmin",borderRadius:"50%",
      background:"radial-gradient(ellipse,"+a+"06 0%,transparent 70%)",
      transform:"rotate("+(Math.random()*40-20)+"deg)",animation:"drift 40s ease-in-out infinite"}}/>)}
    {stars.map((s,i)=><div key={"st"+i} style={{position:"absolute",borderRadius:"50%",background:"#FFF",
      left:s.x+"%",top:s.y+"%",width:s.sz,height:s.sz,opacity:s.op,
      animation:"twinkle "+s.dur+"s ease-in-out "+s.del+"s infinite alternate"}}/>)}
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible"}}>
      {constellations.map((c,i)=><line key={"cl"+i} x1={c.x1+"%"} y1={c.y1+"%"} x2={c.x2+"%"} y2={c.y2+"%"}
        stroke={a} strokeWidth="0.5" opacity="0.06"/>)}
    </svg>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible",opacity:ring3d.op}}>
      <g style={{animation:"orbit3d 20s linear infinite",transformOrigin:`${ring3d.cx}% ${ring3d.cy}%`}}>
        <ellipse cx={ring3d.cx+"%"} cy={ring3d.cy+"%"} rx={ring3d.rx+"%"} ry={ring3d.ry+"%"}
          stroke={a} fill="none" strokeWidth="1" opacity="0.6"/>
      </g>
    </svg>
    {orbitDots.map((d,i)=><div key={"od"+i} style={{
      position:"absolute",left:"50%",top:"40%",
      width:8,height:8,borderRadius:"50%",background:a,
      opacity:d.op,animation:`orbit3d ${12+i}s linear infinite`,transform:"translate(-4px,-4px)",
    }}/>)}
    <div style={{
      position:"absolute",left:sphere3d.cx+"%",top:sphere3d.cy+"%",
      width:sphere3d.r*2,height:sphere3d.r*2,borderRadius:"50%",opacity:sphere3d.op,
      background:`radial-gradient(circle at 30% 30%, ${a}44 0%, ${a}22 40%, ${a}08 100%)`,
      animation:"orbit3d 30s linear infinite",transform:"translate(-50%,-50%)",
    }}/>
    <div style={{position:"absolute",top:"8%",right:"10%"}}>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{opacity:0.08}}>
        <circle cx="12" cy="12" r="10" fill={moonPhase===0?"none":a} stroke={a} strokeWidth="0.5"/>
        {moonPhase===1&&<circle cx="8" cy="12" r="10" fill={"#000"}/>}
        {moonPhase===2&&<rect x="12" y="2" width="10" height="20" fill="#000" opacity="0.9"/>}
        {moonPhase===3&&<circle cx="16" cy="12" r="10" fill="#000" opacity="0.9"/>}
      </svg>
    </div>
    <div style={{position:"absolute",bottom:"10%",left:"50%",transform:"translateX(-50%)",
      fontSize:20,color:a,opacity:0.04,fontFamily:"serif"}}>{"\u221E"}</div>
  </div>;
}

// --- МАНДЕЛЬШТАМ: камень, арки, колонны, акмеизм + 3D COLUMNS ---
function MandD({a}){
  const columns = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()>0.5 ? Math.random()*15+2 : 83+Math.random()*15,
    h:Math.random()*40+30, op:Math.random()*0.05+0.02,
  })),[]);
  const stones = useMemo(()=>Array.from({length:6},()=>({
    x:Math.random()*90+5, y:Math.random()*90+5,
    sz:Math.random()*20+10, op:Math.random()*0.04+0.02, rot:Math.random()*30-15,
  })),[]);
  const arches = useMemo(()=>Array.from({length:2},()=>({
    x:Math.random()*60+20, y:Math.random()*40+10,
    w:Math.random()*80+60, op:Math.random()*0.04+0.02,
  })),[]);
  const cracks = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:Math.random()*80+10,
    len:Math.random()*60+20, rot:Math.random()*180, op:Math.random()*0.03+0.01,
  })),[]);
  const col3d = useMemo(()=>Array.from({length:2},()=>({
    x:Math.random()>0.5 ? Math.random()*12+3 : 85+Math.random()*12,
    op:Math.random()*0.06+0.03,
  })),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
      width:"50vmin",height:"50vmin",borderRadius:"50%",
      background:"radial-gradient(circle,"+a+"08 0%,transparent 60%)"}}/>
    {columns.map((c,i)=><div key={"col"+i} style={{position:"absolute",left:c.x+"%",bottom:"10%",
      width:8,height:c.h+"%",background:`linear-gradient(to top,${a}15,${a}05)`,opacity:c.op,
      borderTop:"2px solid "+a}}/>)}
    {stones.map((s,i)=><div key={"stn"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",
      width:s.sz,height:s.sz*0.7,background:a,opacity:s.op,
      transform:"rotate("+s.rot+"deg)",
      animation:"drift "+(25+Math.random()*15)+"s ease-in-out infinite",
    }}/>)}
    {arches.map((ar,i)=><svg key={"ar"+i} style={{position:"absolute",left:ar.x+"%",top:ar.y+"%",overflow:"visible",opacity:ar.op}}
      width={ar.w} height={ar.w*0.5}>
      <path d={`M0,${ar.w*0.5} Q${ar.w/2},0 ${ar.w},${ar.w*0.5}`} stroke={a} fill="none" strokeWidth="1"/>
    </svg>)}
    {cracks.map((cr,i)=><div key={"cr"+i} style={{position:"absolute",left:cr.x+"%",top:cr.y+"%",
      width:cr.len,height:1,background:a,opacity:cr.op,
      transform:"rotate("+cr.rot+"deg)",transformOrigin:"left center"}}/>)}
    {col3d.map((c,i)=><div key={"c3d"+i} style={{
      position:"absolute",left:c.x+"%",top:"15%",bottom:"15%",width:16,
      perspective:"800px",opacity:c.op,
    }}>
      <div style={{
        width:"100%",height:"100%",
        background:`linear-gradient(to right,${a}20,${a}08,${a}20)`,
        border:`1px solid ${a}`,borderRadius:2,
        transformStyle:"preserve-3d",
        animation:"columnRise 10s ease-in-out infinite",
      }}/>
    </div>)}
    <div style={{position:"absolute",bottom:"8%",left:"50%",transform:"translateX(-50%)",
      fontSize:10,fontFamily:"serif",color:a,opacity:0.04,letterSpacing:6}}>ACME</div>
  </div>;
}

// --- ЦВЕТАЕВА: огонь, тире, разрывы, страсть + 3D FLAMES ---
function TsvetD({a}){
  const dashes = useMemo(()=>Array.from({length:8},()=>({
    x:Math.random()*80+10, y:Math.random()*80+10,
    w:Math.random()*40+15, op:Math.random()*0.06+0.03, rot:Math.random()*10-5,
  })),[]);
  const sparks = useMemo(()=>Array.from({length:12},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*3+1, op:Math.random()*0.1+0.04,
    dur:Math.random()*3+2, del:Math.random()*4,
  })),[]);
  const flames = useMemo(()=>Array.from({length:5},()=>({
    x:Math.random()*80+10, y:70+Math.random()*20,
    sz:Math.random()*20+10, op:Math.random()*0.05+0.02,
  })),[]);
  const breaks = useMemo(()=>Array.from({length:3},()=>({
    y:Math.random()*60+20, op:Math.random()*0.04+0.02,
  })),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",
      background:`linear-gradient(to top,${a}0A,transparent)`,opacity:0.5}}/>
    {dashes.map((d,i)=><div key={"ds"+i} style={{position:"absolute",left:d.x+"%",top:d.y+"%",
      width:d.w,height:2,background:a,opacity:d.op,
      transform:"rotate("+d.rot+"deg)"}}/>)}
    {sparks.map((s,i)=><div key={"sp"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",
      width:s.sz,height:s.sz,borderRadius:"50%",background:a,opacity:s.op,
      animation:`flicker ${s.dur}s ease-in-out ${s.del}s infinite`}}/>)}
    {flames.map((f,i)=><svg key={"fl"+i} style={{position:"absolute",left:f.x+"%",top:f.y+"%",opacity:f.op,
      animation:"subtleBreathe "+(3+Math.random()*2)+"s ease-in-out infinite"}}
      width={f.sz} height={f.sz*2} viewBox="0 0 20 40">
      <path d="M10,0 Q15,10 12,20 Q18,25 10,40 Q2,25 8,20 Q5,10 10,0 Z" fill={a} opacity="0.5"/>
    </svg>)}
    {breaks.map((b,i)=><div key={"br"+i} style={{position:"absolute",left:0,right:0,top:b.y+"%",
      height:1,background:`linear-gradient(90deg,transparent 10%,${a} 30%,transparent 35%,${a} 65%,transparent 70%,${a} 90%)`,
      opacity:b.op}}/>)}
    <div style={{position:"absolute",top:24,left:"50%",transform:"translateX(-50%)",
      fontSize:24,fontFamily:"serif",color:a,opacity:0.06}}>{"\u2014"}</div>
    <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
      fontSize:24,fontFamily:"serif",color:a,opacity:0.06}}>{"\u2014"}</div>
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
      width:"45vmin",height:"45vmin",borderRadius:"50%",
      background:`radial-gradient(circle,${a}08 0%,transparent 60%)`}}/>
  </div>;
}

// --- БЛОК: туман, снег, мистика, символизм + 3D SNOWFLAKES ---
function BlokD({a}){
  const snowflakes = useMemo(()=>Array.from({length:20},()=>({
    x:Math.random()*100, sz:Math.random()*3+1, op:Math.random()*0.08+0.03,
    dur:Math.random()*15+10, del:Math.random()*10,
  })),[]);
  const mistLayers = useMemo(()=>Array.from({length:3},(_,i)=>({
    y:20+i*25, op:Math.random()*0.04+0.02, w:Math.random()*40+40,
  })),[]);
  const halos = useMemo(()=>Array.from({length:2},()=>({
    x:Math.random()*60+20, y:Math.random()*40+10,
    sz:Math.random()*40+30, op:Math.random()*0.04+0.02,
  })),[]);
  const crosses = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:Math.random()*70+10,
    sz:Math.random()*10+6, op:Math.random()*0.04+0.02,
  })),[]);
  const tumbleSnow = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()*100, sz:Math.random()*8+4, op:Math.random()*0.06+0.03, dur:Math.random()*20+15,
  })),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",inset:0,
      background:`radial-gradient(ellipse at 50% 30%,${a}0C 0%,transparent 60%)`}}/>
    {mistLayers.map((m,i)=><div key={"mst"+i} style={{position:"absolute",left:0,right:0,top:m.y+"%",
      height:"15%",background:`linear-gradient(90deg,transparent,${a}08,${a}10,${a}08,transparent)`,
      opacity:m.op,animation:"drift "+(30+i*10)+"s ease-in-out infinite"}}/>)}
    {snowflakes.map((s,i)=><div key={"sn"+i} style={{position:"absolute",left:s.x+"%",top:"-2%",
      width:s.sz,height:s.sz,borderRadius:"50%",background:"#FFF",opacity:s.op,
      animation:`snowfall ${s.dur}s linear ${s.del}s infinite`}}/>)}
    {halos.map((h,i)=><div key={"hl"+i} style={{position:"absolute",left:h.x+"%",top:h.y+"%",
      width:h.sz,height:h.sz,borderRadius:"50%",
      border:"1px solid "+a,opacity:h.op,transform:"translate(-50%,-50%)",
      animation:"subtleBreathe 6s ease-in-out infinite"}}/>)}
    {crosses.map((c,i)=><div key={"cr"+i} style={{position:"absolute",left:c.x+"%",top:c.y+"%",opacity:c.op}}>
      <div style={{position:"absolute",width:1,height:c.sz,background:a,left:"50%",transform:"translateX(-50%)"}}/>
      <div style={{position:"absolute",height:1,width:c.sz*0.7,background:a,top:c.sz*0.3,left:"50%",transform:"translateX(-50%)"}}/>
    </div>)}
    {tumbleSnow.map((ts,i)=><div key={"ts3d"+i} style={{
      position:"absolute",left:ts.x+"%",top:"-5%",perspective:"500px",
    }}>
      <div style={{
        width:ts.sz,height:ts.sz,borderRadius:"50%",background:"#FFF",opacity:ts.op,
        animation:`snowfall ${ts.dur}s linear infinite, tumble3d ${ts.dur*0.8}s linear infinite`,
      }}/>
    </div>)}
    <div style={{position:"absolute",bottom:"8%",left:"50%",transform:"translateX(-50%)",
      width:60,height:1,background:`linear-gradient(90deg,transparent,${a}30,transparent)`,opacity:0.3}}/>
  </div>;
}

// --- ПАСТЕРНАК: дождь, сад, свечи, природа + 3D RAINDROPS ---
function PastD({a}){
  const raindrops = useMemo(()=>Array.from({length:15},()=>({
    x:Math.random()*100, dur:Math.random()*4+2, del:Math.random()*5,
    h:Math.random()*15+8, op:Math.random()*0.06+0.02,
  })),[]);
  const branches = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()>0.5 ? Math.random()*20 : 80+Math.random()*20,
    y:Math.random()*30, len:Math.random()*60+30, rot:Math.random()*40-20,
    op:Math.random()*0.04+0.02,
  })),[]);
  const candles = useMemo(()=>Array.from({length:2},()=>({
    x:Math.random()*60+20, y:60+Math.random()*25,
    op:Math.random()*0.06+0.03,
  })),[]);
  const puddles = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*70+15, y:80+Math.random()*15,
    w:Math.random()*60+30, op:Math.random()*0.03+0.01,
  })),[]);
  const gardenGlow = useMemo(()=>({
    x:Math.random()*40+30, y:Math.random()*30+35,
  }),[]);

  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:gardenGlow.y+"%",left:gardenGlow.x+"%",
      transform:"translate(-50%,-50%)",
      width:"50vmin",height:"50vmin",borderRadius:"50%",
      background:`radial-gradient(circle,${a}0A 0%,transparent 60%)`}}/>
    {raindrops.map((r,i)=><div key={"rd"+i} style={{position:"absolute",left:r.x+"%",top:"-2%",
      width:1,height:r.h,background:`linear-gradient(to bottom,transparent,${a})`,opacity:r.op,
      animation:`raindrop ${r.dur}s linear ${r.del}s infinite`}}/>)}
    {branches.map((b,i)=><svg key={"br"+i} style={{position:"absolute",left:b.x+"%",top:b.y+"%",overflow:"visible",opacity:b.op}}
      width={b.len} height="30">
      <path d={`M0,15 Q${b.len*0.3},${15+b.rot*0.5} ${b.len*0.6},10 Q${b.len*0.8},${15-b.rot*0.3} ${b.len},12`}
        stroke={a} fill="none" strokeWidth="0.8"/>
      {[0.3,0.5,0.7].map((t,j)=><circle key={j} cx={b.len*t} cy={12+Math.random()*6} r={Math.random()*2+1}
        fill={a} opacity="0.4"/>)}
    </svg>)}
    {candles.map((c,i)=><div key={"cn"+i} style={{position:"absolute",left:c.x+"%",top:c.y+"%",opacity:c.op}}>
      <div style={{width:4,height:20,background:`linear-gradient(to top,${a}30,${a}10)`,margin:"0 auto"}}/>
      <div style={{width:6,height:8,borderRadius:"50% 50% 50% 50% / 60% 60% 40% 40%",
        background:`radial-gradient(circle at 50% 60%,${a}90,${a}40,transparent)`,
        margin:"-4px auto 0",animation:"flicker 2s ease-in-out infinite"}}/>
    </div>)}
    {puddles.map((p,i)=><div key={"pd"+i} style={{position:"absolute",left:p.x+"%",top:p.y+"%",
      width:p.w,height:p.w*0.15,borderRadius:"50%",
      border:"1px solid "+a,opacity:p.op,
      animation:"subtleBreathe 5s ease-in-out infinite"}}/>)}
    <div style={{position:"absolute",bottom:"10%",right:"10%",fontSize:10,fontFamily:"serif",
      color:a,opacity:0.04,fontStyle:"italic"}}>{"~"}</div>
  </div>;
}

const DM={m:MayaD,p:PushD,b:BrodD,e:EsenD,t:TyutD,md:MandD,ts:TsvetD,bl:BlokD,pa:PastD};

function Pts({pid,a}){
  const items=useMemo(()=>{
    const n=pid==="t"||pid==="bl"?0:pid==="b"?6:12;
    return Array.from({length:n},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,
      sz:pid==="m"?Math.random()*3+1.5:Math.random()*2.5+1,
      dur:Math.random()*25+12,del:Math.random()*8,
      op:pid==="m"?Math.random()*0.12+0.04:Math.random()*0.08+0.02}));
  },[pid]);
  if(!items.length)return null;
  return <>{items.map(p=><div key={p.id} style={{position:"absolute",pointerEvents:"none",left:p.x+"%",top:p.y+"%",
    width:pid==="b"?p.sz*3:p.sz,height:pid==="b"?1:p.sz,
    backgroundColor:a,opacity:p.op,
    animation:"drift "+p.dur+"s ease-in-out "+p.del+"s infinite",
    borderRadius:pid==="m"?"0":"50%",transform:pid==="m"?"rotate(45deg)":undefined}}/>)}</>;
}

// ═══ DAILY QUOTE LOGIC ═══
const STORAGE_KEY = "strokhu_daily";
const HISTORY_KEY = "strokhu_history";

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function saveHistory(seen) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(seen));
  } catch {}
}

function getSavedQuote() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date === getTodayString()) return data;
    return null;
  } catch { return null; }
}

function saveQuote(quoteIndex, paletteIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayString(),
      qi: quoteIndex,
      pi: paletteIndex,
    }));
  } catch {}
}

function pickRandom() {
  let seen = getHistory();
  if (seen.length >= Q.length) {
    seen = [];
    saveHistory(seen);
  }
  const available = [];
  for (let i = 0; i < Q.length; i++) {
    if (!seen.includes(i)) available.push(i);
  }
  const qi = available[Math.floor(Math.random() * available.length)];
  seen.push(qi);
  saveHistory(seen);

  const poet = PC[Q[qi].p];
  const pi = Math.floor(Math.random() * poet.pl.length);
  return { qi, pi };
}

// ═══ HOME SCREEN ═══
function HomeScreen({ onRequest, alreadyUsed, savedQuote }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#050505", color: "#e8e8e8",
      fontFamily: "'Cormorant Garamond', serif",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vmin", height: "60vmin", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      <div style={{
        textAlign: "center", zIndex: 1,
        animation: "fadeInUp 1s ease-out",
      }}>
        <div style={{
          fontSize: 14, letterSpacing: 12, opacity: 0.15,
          marginBottom: 40, color: "#aaa",
        }}>
          {"  \u2022  "}
        </div>

        <h1 style={{
          fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
          fontWeight: 300,
          letterSpacing: "0.08em",
          lineHeight: 1.4,
          marginBottom: 12,
          color: "#d4d0c8",
        }}>
          Строчку, будьте добры
        </h1>

        <p style={{
          fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
          fontWeight: 300,
          opacity: 0.3,
          letterSpacing: "0.04em",
          marginBottom: 60,
          fontStyle: "italic",
        }}>
          одна цитата — один день
        </p>

        {alreadyUsed ? (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            <button
              onClick={() => onRequest(savedQuote)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#b0a890",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                fontWeight: 400,
                fontStyle: "italic",
                padding: "16px 44px",
                borderRadius: 2,
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
                opacity: hovered ? 0.9 : 0.6,
              }}
            >
              вспомнить сегодняшнюю
            </button>
            <p style={{
              marginTop: 24,
              fontSize: "0.8rem",
              opacity: 0.2,
              fontStyle: "italic",
            }}>
              приходите завтра за новой строчкой
            </p>
          </div>
        ) : (
          <button
            onClick={() => onRequest(null)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255," + (hovered ? "0.25" : "0.12") + ")",
              color: hovered ? "#fff" : "#d4d0c8",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
              fontWeight: 400,
              padding: "18px 52px",
              borderRadius: 2,
              cursor: "pointer",
              letterSpacing: "0.06em",
              transition: "all 0.4s ease",
              animation: "pulseGlow 4s ease-in-out infinite",
            }}
          >
            строчку, будьте добры
          </button>
        )}

        <div style={{
          fontSize: 14, letterSpacing: 12, opacity: 0.15,
          marginTop: 60, color: "#aaa",
        }}>
          {"  \u2022  "}
        </div>
      </div>
    </div>
  );
}

// ═══ QUOTE SCREEN ═══
function QuoteScreen({ quote, poet, palette, onBack }) {
  const D = DM[quote.p];

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: palette.bg,
      color: palette.t,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      animation: "bgTransition 0.8s ease-out",
      overflow: "hidden",
    }}>
      {D && <D a={palette.a} />}
      <Pts pid={quote.p} a={palette.a} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 680, width: "90%",
        padding: "40px 24px",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: poet.tf,
          fontSize: quote.p === "m" ? "clamp(0.7rem, 2vw, 0.9rem)" : "clamp(0.8rem, 2.2vw, 1rem)",
          fontWeight: quote.p === "b" ? 300 : 400,
          letterSpacing: quote.p === "m" ? "0.2em" : quote.p === "b" ? "0.15em" : "0.1em",
          textTransform: quote.p === "m" ? "uppercase" : "none",
          color: palette.a,
          opacity: 0.85,
          marginBottom: quote.p === "b" ? 40 : 32,
          animation: "metaReveal 0.8s ease-out 0.2s both",
        }}>
          {poet.l}
        </div>

        <blockquote style={{
          fontFamily: poet.qf,
          fontSize: poet.sz,
          fontWeight: poet.qw,
          fontStyle: poet.qs,
          lineHeight: poet.lh,
          letterSpacing: poet.ls,
          color: palette.t,
          margin: 0,
          padding: 0,
          animation: "quoteReveal 1s ease-out 0.5s both",
        }}>
          {quote.p === "m" && <span style={{ color: palette.a, opacity: 0.5, marginRight: 8 }}>{"\u00AB"}</span>}
          {quote.t}
          {quote.p === "m" && <span style={{ color: palette.a, opacity: 0.5, marginLeft: 8 }}>{"\u00BB"}</span>}
        </blockquote>

        <div style={{
          fontFamily: poet.mf,
          fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
          fontWeight: 300,
          fontStyle: quote.p === "e" ? "italic" : "normal",
          color: palette.a,
          opacity: 0.45,
          marginTop: quote.p === "b" ? 40 : 28,
          letterSpacing: quote.p === "b" ? "0.08em" : "0.04em",
          animation: "metaReveal 0.8s ease-out 0.9s both",
        }}>
          {quote.p === "b" ? `// ${quote.s}` : `\u2014 ${quote.s}`}
        </div>
      </div>

      <SharePanel quote={quote} poet={poet} palette={palette} />

      <button
        onClick={onBack}
        style={{
          position: "absolute",
          bottom: 32,
          background: "none",
          border: "none",
          color: palette.a,
          opacity: 0.25,
          fontFamily: poet.mf,
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          cursor: "pointer",
          padding: "8px 16px",
          transition: "opacity 0.3s",
          animation: "fadeIn 1s ease-out 1.2s both",
          zIndex: 10,
        }}
        onMouseEnter={e => e.target.style.opacity = 0.5}
        onMouseLeave={e => e.target.style.opacity = 0.25}
      >
        {"\u2190"}
      </button>
    </div>
  );
}

// ═══ MAIN APP ═══
export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentQuote, setCurrentQuote] = useState(null);
  const [exiting, setExiting] = useState(false);

  const [saved, setSaved] = useState(() => getSavedQuote());
  const alreadyUsed = saved !== null;

  const handleRequest = useCallback((savedData) => {
    let qi, pi;

    if (savedData) {
      qi = savedData.qi;
      pi = savedData.pi;
    } else {
      const pick = pickRandom();
      qi = pick.qi;
      pi = pick.pi;
      saveQuote(qi, pi);
      setSaved({ date: getTodayString(), qi, pi });
    }

    const quote = Q[qi];
    const poet = PC[quote.p];
    const palette = poet.pl[pi % poet.pl.length];

    setCurrentQuote({ quote, poet, palette });

    setExiting(true);
    setTimeout(() => {
      setScreen("quote");
      setExiting(false);
    }, 500);
  }, []);

  const handleBack = useCallback(() => {
    setScreen("home");
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#050505" }}>
      {screen === "home" && (
        <div style={{
          animation: exiting ? "homeExit 0.5s ease-in forwards" : undefined,
        }}>
          <HomeScreen
            onRequest={handleRequest}
            alreadyUsed={alreadyUsed}
            savedQuote={saved}
          />
        </div>
      )}

      {screen === "quote" && currentQuote && (
        <QuoteScreen
          quote={currentQuote.quote}
          poet={currentQuote.poet}
          palette={currentQuote.palette}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
