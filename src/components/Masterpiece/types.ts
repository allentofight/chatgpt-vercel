// types.ts

export interface PicOption {
  ratio: string;
  desc: string;
  img: string;
}

// 头像比例选择
export const picOptions: PicOption[] = [
  {
    ratio: '1:1',
    desc: '头像图',
    img: '/svg/1-1.svg',
  },
  {
    ratio: '1:2',
    desc: '手机壁纸',
    img: '/svg/1-2.svg',
  },
  {
    ratio: '3:4',
    desc: '文案图',
    img: '/svg/3-4.svg',
  },
  {
    ratio: '4:3',
    desc: '社交媒体',
    img: '/svg/4-3.svg',
  },
  {
    ratio: '9:16',
    desc: '宣传海报',
    img: '/svg/9-16.svg',
  },
  {
    ratio: '自定义',
    desc: '自定义',
    img: '自定义',
  },
];


// 关键词推荐
export const keyWords = [
  {
    title: '质量',
    types: [
      {
        title: '标准',
        selections: [
          {
            en: 'UHD',
            ch: '超高清',
          },
          {
            en: 'anatomically correct',
            ch: '解剖学正确',
          },
          {
            en: 'ccurate',
            ch: '准确',
          },
          {
            en: 'textured skin',
            ch: '质感皮肤',
          },
          {
            en: 'super detail',
            ch: '非常详细',
          },
          {
            en: 'high details',
            ch: '高细节',
          },
          {
            en: 'award winning',
            ch: '屡获殊荣',
          },
          {
            en: 'best quality',
            ch: '最佳质量',
          },
          {
            en: 'high quality',
            ch: '高质量'
          }
        ]
      },
      {
        title: '画质',
        selections: [
          { en: '1080P' },
          { en: 'retina', ch: '视网膜屏' },
          { en: 'HD' },
          { en: '16k' },
          { en: '8k' },
          { en: '4K' },
        ]
      },
    ]
  },
  {
    title: '绘画',
    types: [{
      title: '风格',
      selections: [
        {
          en: 'Surrealism',
          ch: '超现实主义',
        },
        {
          en: 'Color Field painting',
          ch: '色块画',
        },
        {
          en: 'Art Deco',
          ch: '装饰艺术',
        },
        {
          en: 'rococo style',
          ch: '洛可可风格',
        },
        {
          en: 'high detail',
          ch: '高细节',
        },
        {
          en: 'blind box toy style',
          ch: '盲盒玩具风格',
        },
        {
          en: 'Cubist Futurism',
          ch: '立体派未来主义',
        },
        {
          en: 'Conceptual art',
          ch: '概念艺术',
        },
        {
          en: 'Futurism',
          ch: '未来主义',
        },
        {
          en: 'Social realism',
          ch: '社会现实主义',
        },
        {
          en: 'interior architecture',
          ch: '室内建筑',
        },
        {
          en: 'Renaissance',
          ch: '文艺复兴',
        },
        {
          en: 'Neoclassicism',
          ch: '新古典主义',
        },
        {
          en: 'modern',
          ch: '现代',
        },
        {
          en: 'anime',
          ch: '动漫',
        },
        {
          en: 'Minimalism',
          ch: '极简主义',
        },
        {
          en: 'Romanticism',
          ch: '浪漫主义',
        },
        {
          en: 'Gothic art',
          ch: '哥特式艺术',
        },
        {
          en: 'American propaganda poster',
          ch: '美国宣传海报',
        },
        {
          en: 'Tonalism',
          ch: '色调主义',
        },
        {
          en: 'Baroque',
          ch: '巴洛克',
        },
        {
          en: 'Fauvism',
          ch: '野兽派',
        },
        {
          en: 'Expressionism',
          ch: '表现主义',
        },
        {
          en: 'Carl Larsson',
          ch: '卡尔·拉尔松风格的画作',
        },
        {
          en: 'Op art',
          ch: '视错觉艺术',
        },
        {
          en: 'Realism',
          ch: '现实主义',
        },
        {
          en: 'Contemporary art',
          ch: '当代艺术',
        },
        {
          en: 'Genre painting',
          ch: '风俗画',
        },
        {
          en: 'Constructivism',
          ch: '构成主义',
        },
        {
          en: 'Mannerism',
          ch: '后期文艺复兴',
        },
        {
          en: 'Bauhaus',
          ch: '包豪斯',
        },
        {
          en: 'Action painting',
          ch: '行动绘画',
        },
        {
          en: "by Alfons Mucha",
          ch: "由阿尔方斯·穆卡制作"
        },
        {
          en: "Dutch Golden Age painting",
          ch: "荷兰黄金时期绘画"
        },
        {
          en: "Pop art",
          ch: "波普艺术"
        },
        {
          en: "Monet",
          ch: "莫奈"
        },
        {
          en: "Northern Renaissance",
          ch: "北方文艺复兴"
        },
        {
          en: "Dadaism",
          ch: "达达主义"
        },
        {
          en: "Ukiyo-e",
          ch: "浮世绘"
        },
        {
          en: "Luminism",
          ch: "明亮主义"
        },
        {
          en: "Abstract expressionism",
          ch: "抽象表现主义"
        },
        {
          en: "Impressionism",
          ch: "印象派"
        },
        {
          en: "Pre-Raphaelite Brotherhood",
          ch: "前拉斐尔派兄弟会"
        },
        {
          en: "Classicism",
          ch: "古典主义"
        },
        {
          en: "Ghibli-like colours",
          ch: "吉卜力色彩"
        },
        {
          en: "Hyperrealism",
          ch: "超现实主义细节画派"
        },
        {
          en: "Art Nouveau",
          ch: "新艺术运动"
        },
        {
          en: "Suprematism",
          ch: "至高主义"
        },
        {
          en: "Abstractionism",
          ch: "抽象主义"
        },
        {
          en: "pre-rephaëlite painting",
          ch: "前拉斐尔派绘画"
        },
        {
          en: "anime style",
          ch: "动漫风格"
        },
        {
          en: "Post-Impressionism",
          ch: "后印象派"
        },
        {
          en: "En plein air",
          ch: "野外写生"
        },
        {
          en: "Pointillism",
          ch: "点彩派"
        },
        {
          en: "Verism",
          ch: "写实主义"
        },
        {
          en: "raised fist",
          ch: "扬起的拳头"
        },
        {
          en: "Ashcan School",
          ch: "垃圾桶派"
        },
        {
          en: "Pixar",
          ch: "皮克斯"
        },
        {
          en: "Cubism",
          ch: "立体主义"
        },
        {
          en: "--style",
          ch: "风格"
        }
      ]
    }]
  },
  {
    title: '画面',
    types: [{
      title: '效果',
      selections: [
        {
          en: "Chiaroscuro",
          ch: "明暗对比"
        },
        {
          en: "motion blur",
          ch: "动态模糊"
        },
        {
          en: "cinematic lighting",
          ch: "电影光效"
        },
        {
          en: "chromatic aberration",
          ch: "色差"
        },
        {
          en: "sparkle",
          ch: "闪耀效果"
        },
        {
          en: "jpeg artifacts",
          ch: "JPEJ 压缩失真"
        },
        {
          en: "depth of field",
          ch: "背景虚化"
        },
        {
          en: "blurry",
          ch: "模糊的"
        },
        {
          en: "glowing light",
          ch: "荧光"
        },
        {
          en: "god rays",
          ch: "神圣感顶光"
        },
        {
          en: "ray tracing",
          ch: "光线追踪"
        },
        {
          en: "reflection light",
          ch: "反射光"
        },
        {
          en: "backlighting",
          ch: "逆光"
        },
        {
          en: "blending",
          ch: "混合"
        },
        {
          en: "bloom",
          ch: "盛开"
        },
        {
          en: "chromatic aberration abuse",
          ch: "色差滥用"
        },
        {
          en: "dithering",
          ch: "抖动"
        },
        {
          en: "drop shadow",
          ch: "立绘阴影"
        },
        {
          en: "film grain",
          ch: "胶片颗粒感/老电影过滤"
        },
        {
          en: "Fujicolor",
          ch: "富士色彩"
        },
        {
          en: "halftone",
          ch: "半调风格"
        },
        {
          en: "image fill",
          ch: "图像填充"
        },
        {
          en: "motion lines",
          ch: "体现运动的线"
        },
        {
          en: "multiple monochrome",
          ch: "多重单色"
        },
        {
          en: "optical illusion",
          ch: "视错觉"
        },
        {
          en: "anaglyph",
          ch: "互补色"
        },
        {
          en: "stereogram",
          ch: "立体画"
        },
        {
          en: "scanlines",
          ch: "扫描线"
        },
        {
          en: "silhouette",
          ch: "剪影"
        },
        {
          en: "speed lines",
          ch: "速度线"
        },
        {
          en: "vignetting",
          ch: "晕影"
        }
      ]

    }]
  },
  {
    title: '容貌',
    types: [{
      title: '眼睛',
      selections: [
        {
          en: "mole under eye",
          ch: "眼下痣"
        },
        {
          en: "heart-shaped pupils",
          ch: "爱心瞳"
        },
        {
          en: "rolling eyes",
          ch: "翻白眼"
        },
        {
          en: "crazy eyes",
          ch: "疯狂的眼睛"
        },
        {
          en: "raised eyebrows",
          ch: "挑眉"
        },
        {
          en: "furrowed brow",
          ch: "下眉毛"
        }
      ]
    }, {
      title: '头发',
      selections: [
        { en: "streaked hair", ch: "条染" },
        { en: "multicolored hair", ch: "多彩头发" },
        { en: "colored inner hair", ch: "内侧染色" },
        { en: "blonde hair", ch: "金发" },
        { en: "silver hair", ch: "银发" },
        { en: "grey hair", ch: "灰发" },
        { en: "white hair", ch: "白发" },
        { en: "brown hair", ch: "茶发" },
        { en: "light brown hair", ch: "浅褐发" },
        { en: "black hair", ch: "黑发" },
        { en: "purple hair", ch: "紫发" },
        { en: "red hair", ch: "红发" },
        { en: "blue hair", ch: "蓝发/水色发" },
        { en: "dark blue hair", ch: "深蓝发" },
        { en: "light blue hair", ch: "浅蓝发" },
        { en: "green hair", ch: "绿发" },
        { en: "pink hair", ch: "粉发" },
        { en: "gradient hair", ch: "渐变发色" },
        { en: "rainbow hair", ch: "彩虹发" },
        { en: "ahoge", ch: "呆毛" },
        { en: "asymmetrical hair", ch: "非对称发型" },
        { en: "bangs", ch: "刘海" },
        { en: "blunt bangs", ch: "齐刘海" },
        { en: "braid", ch: "辫子" },
        { en: "braided ponytail", ch: "编织马尾辫" },
        { en: "curly hair", ch: "卷发" },
        { en: "curtained hair", ch: "窗帘/瀑布发型" },
        { en: "double bun", ch: "双团子头" },
        { en: "drill hair", ch: "钻头卷/公主卷" },
        { en: "twin drills", ch: "双钻头卷" },
        { en: "quad drills", ch: "多钻头卷" },
        { en: "side drill", ch: "单侧钻头卷" },
        { en: "french braid", ch: "法式辫" },
        { en: "hair behind ear", ch: "耳后发" },
        { en: "hair between eyes", ch: "眼间刘海" },
        { en: "crossed bangs", ch: "交错刘海" },
        { en: "hair bun", ch: "团子头" },
        { en: "hair intakes", ch: "进气口发型" },
        { en: "hair over shoulder", ch: "披肩发" },
        { en: "hime cut", ch: "姬发式" },
        { en: "long hair", ch: "长发" },
        { en: "messy hair", ch: "凌乱发型" },
        { en: "parted bangs", ch: "分开的刘海" },
        { en: "ponytail", ch: "马尾" },
        { en: "short hair", ch: "短发" },
        { en: "short ponytail", ch: "短马尾" },
        { en: "side swept bangs", ch: "朝一个方向的刘海" },
        { en: "side ponytail", ch: "侧马尾" },
        { en: "twin braids", ch: "双辫子" },
        { en: "twintails", ch: "双马尾" },
        { en: "very long hair", ch: "很长的头发" },
        { en: "front ponytail", ch: "前马尾" },
        { en: "short twintails", ch: "短双马尾" },
        { en: "folded ponytail", ch: "折叠马尾" },
        { en: "quad tails", ch: "四马尾" },
        { en: "single braid", ch: "单辫" },
        { en: "low twin braids", ch: "低双辫" },
        { en: "side braid", ch: "侧辫" },
        { en: "crown braid", ch: "冠型织辫" },
        { en: "dreadlocks", ch: "脏辫" },
        { en: "cone hair bun", ch: "锥形发髻" },
        { en: "braided bun", ch: "辫子髻" },
        { en: "doughnut hair bun", ch: "圆环发髻" },
        { en: "heart hair bun", ch: "心形发髻" },
        { en: "wavy hair", ch: "自然卷" },
        { en: "asymmetrical bangs", ch: "不对称刘海" },
        { en: "swept bangs", ch: "扫浏海" },
        { en: "sidelocks", ch: "耳前发" },
        { en: "single sidelock", ch: "单耳前发" },
        { en: "hair pulled back", ch: "头发后梳" },
        { en: "half updo", ch: "侧发后梳" },
        { en: "hair one side up", ch: "一侧绑发" },
        { en: "hair two side up", ch: "双侧绑发" },
        { en: "hair spread out", ch: "散发" },
        { en: "floating hair", ch: "漂浮的头发" },
        { en: "straight hair", ch: "直发" },
        { en: "big hair", ch: "头发很多的" },
        { en: "crystal hair", ch: "水晶状的头发" },
        { en: "expressive hair", ch: "富有表现力的头发" },
        { en: "hair over eyes", ch: "头发遮着双眼" },
        { en: "hair strand", ch: "强调一缕一缕感的发型/发丝" },
        { en: "hair over one eye", ch: "头发遮住了一只眼睛" },
        { en: "shiny hair", ch: "有光泽的头发" },
        { en: "wet hair", ch: "湿头发" },
        { en: "hair slicked back", ch: "垂下的长鬈发" },
        { en: "high ponytail", ch: "披在两侧的两条辫子" },
        { en: "long braid", ch: "侧马尾" },
        { en: "low-tied long hair", ch: "直发" },
        { en: "low ponytail", ch: "低扎马尾" },
        { en: "low twintails", ch: "低扎双尾" },
        { en: "medium hair", ch: "中等长发" },
        { en: "ringlets", ch: "垂下的长鬈发" },
        { en: "side braids", ch: "披在两侧的两条辫子" },
        { en: "side bun", ch: "披在两侧的发髻" },
        { en: "split ponytail", ch: "尾部散开的单马尾发型" },
        { en: "two side up", ch: "小型双股辫" },
        { en: "absurdly long hair", ch: "超长的头发" },
        { en: "cloud hair", ch: "云絮状发型" },
        { en: "flipped hair", ch: "外卷发型" },
        { en: "tentacle hair", ch: "触手头发" },
        { en: "very short hair", ch: "很短的头发" },
        { en: "bangs pinned back", ch: "掀起的刘海" },
        { en: "braided bangs", ch: "辫子刘海" },
        { en: "diagonal bangs", ch: "斜刘海" },
        { en: "single hair intake", ch: "单侧进气口发型" },
        { en: "hair ears", ch: "耳状头发" },
        { en: "bald", ch: "秃头" },
        { en: "bald girl", ch: "秃头女孩" },
        { en: "bowl cut", ch: "锅盖头" },
        { en: "buzz cut", ch: "寸头" },
        { en: "chonmage", ch: "丁髷" },
        { en: "crew cut", ch: "平头/板寸头" },
        { en: "flattop", ch: "平顶" },
        { en: "okappa", ch: "河童头" },
        { en: "pixie cut", ch: "精灵头" },
        { en: "undercut", ch: "帽盔式发型" },
        { en: "bob cut", ch: "波波头" },
        { en: "cornrows", ch: "玉米垄发型" },
        { en: "mullet", ch: "鲻鱼头" },
        { en: "bow-shaped hair", ch: "弓形头发" },
        { en: "front braid", ch: "前辫" },
        { en: "multiple braids", ch: "多股(麻花)辫" },
        { en: "tri braids", ch: "三股辫" },
        { en: "quad braids", ch: "四股辫" },
        { en: "triple bun", ch: "三发髻" },
        { en: "hair rings", ch: "发圈" },
        { en: "tied hair", ch: "扎头发" },
        { en: "single hair ring", ch: "单发圈" },
        { en: "one side up", ch: "只扎了一边的头发" },
        { en: "low-braided long hair", ch: "低辫长发" },
        { en: "mizura", ch: "角发" },
        { en: "multi-tied hair", ch: "多扎头发" },
        { en: "nihongami", ch: "日本发" },
        { en: "topknot", ch: "丸子头" },
        { en: "uneven twintails", ch: "两股辫子大小不一" },
        { en: "tri tails", ch: "有三股辫子" },
        { en: "quin tails", ch: "有五股辫子" },
        { en: "afro", ch: "鸟窝头/爆炸头" },
        { en: "huge afro", ch: "超大鸟窝头" },
        { en: "beehive hairdo", ch: "蜂窝头" },
        { en: "pompadour", ch: "蓬帕杜发型" },
        { en: "quiff", ch: "蓬松感油头" },
        { en: "hair flaps", ch: "在摆动的头发" },
        { en: "pointy hair", ch: "带着尖角的发型" },
        { en: "spiked hair", ch: "刺刺的头发" },
        { en: "widow's peak", ch: "美人尖" },
        { en: "heart ahoge", ch: "心形呆毛" },
        { en: "huge ahoge", ch: "大呆毛" },
        { en: "antenna hair", ch: "多根呆毛" },
        { en: "comb over", ch: "遮盖头发稀少部分" },
        { en: "mohawk", ch: "莫霍克发型" },
        { en: "lone nape hair", ch: "孤颈毛" },
        { en: "hair bikini", ch: "头发比基尼" },
        { en: "hair scarf", ch: "头发围巾" },
      ]
    }, {
      title: '头饰',
      selections: [
        { en: "halo", ch: "头顶光环" },
        { en: "tokin hat", ch: "东金帽子" },
        { en: "mini top hat", ch: "迷你礼帽" },
        { en: "beret", ch: "贝雷帽" },
        { en: "hood", ch: "兜帽" },
        { en: "nurse cap", ch: "护士帽" },
        { en: "tiara", ch: "三重冕" },
        { en: "crown", ch: "皇冠" },
        { en: "hairpin", ch: "发卡" },
        { en: "hairband", ch: "头箍" },
        { en: "hairclip", ch: "发夹" },
        { en: "hair ribbon", ch: "发带" },
        { en: "hair flower", ch: "发花" },
        { en: "hair ornament", ch: "头饰" },
        { en: "hair bow", ch: "蝴蝶结发饰" },
        { en: "maid headdress", ch: "女仆头饰" },
        { en: "ribbon", ch: "丝带" },
        { en: "sunglasses", ch: "太阳镜" },
        { en: "blindfold", ch: "眼罩" },
        { en: "eyepatch", ch: "单眼罩" },
        { en: "mask", ch: "面具/眼罩/口罩" },
        { en: "jewelry", ch: "首饰" },
        { en: "bell", ch: "铃铛" },
        { en: "facepaint", ch: "面纹" },
        { en: "horns", ch: "兽角" },
        { en: "antlers", ch: "鹿角" },
        { en: "clover hair ornament", ch: "三叶草发饰" },
        { en: "crescent hair ornament", ch: "月牙发饰" },
        { en: "demon horns", ch: "恶魔的角" },
        { en: "jeweled branch of hourai", ch: "蓬莱玉枝" },
        { en: "fish hair ornament", ch: "鱼形发饰" },
        { en: "forehead jewel", ch: "额前有宝石" },
        { en: "forehead mark", ch: "额前有图案" },
        { en: "forehead protector", ch: "护额" },
        { en: "kanzashi", ch: "簪子" },
        { en: "hair bobbles", ch: "头绳" },
        { en: "hairpods", ch: "头发上成对的像无线蓝牙的发饰" },
        { en: "hair bell", ch: "头发上系着铃铛" },
        { en: "heart-shaped eyewear", ch: "心形眼镜" },
        { en: "goggles", ch: "护目镜" },
        { en: "rimless eyewear", ch: "无框眼镜" },
        { en: "over-rim eyewear", ch: "下半无框眼镜" },
        { en: "kamina shades", ch: "卡米纳墨镜" },
        { en: "goggles on head", ch: "头上别着护目镜" },
        { en: "goggles on headwear", ch: "帽子上别着护目镜" },
        { en: "head mounted display", ch: "戴着头戴显示设备" },
        { en: "bandage on", ch: "贴有绷带的脸" },
        { en: "bandage over one eye", ch: "缠着绷带的单眼" },
        { en: "scar across eye", ch: "眼睛上的疤痕" },
        { en: "scar on cheek", ch: "脸颊上的疤痕" },
        { en: "covered eyes", ch: "蒙住的眼" },
        { en: "surgical mask", ch: "医用口罩" },
        { en: "mouth mask", ch: "口罩" },
        { en: "mouth veil", ch: "面纱" },
        { en: "coke-bottle glasses", ch: "厚如玻璃瓶底的圆眼镜" },
        { en: "tengu mask", ch: "天狗面具" },
        { en: "fox mask", ch: "狐狸面具" },
        { en: "mask on head", ch: "掀到头上的面具" },
        { en: "mask pull", ch: "拉着口罩" },
        { en: "mask removed", ch: "摘下的面具" },
        { en: "gas mask", ch: "防毒面具" },
        { en: "anchor choker", ch: "锚形项圈" },
        { en: "bead necklace", ch: "珠子项链" },
        { en: "headphones", ch: "耳机" },
        { en: "behind-the-head headphones", ch: "从后脑戴上的耳机" },
        { en: "whistle around neck", ch: "脖子上挂着口哨" },
        { en: "animal hood", ch: "兽耳头罩" },
        { en: "bespectacled", ch: "戴眼镜的" },
        { en: "fedora", ch: "软呢帽" },
        { en: "witch hat", ch: "女巫帽" },
        { en: "wizard hat", ch: "法师帽" },
        { en: "winged helmet", ch: "带翅膀的头盔" },
        { en: "hood down", ch: "放下的兜帽" },
        { en: "hood up", ch: "戴起来的兜帽" },
        { en: "sailor hat", ch: "水手帽" },
        { en: "santa hat", ch: "圣诞帽" },
        { en: "peaked cap", ch: "类似警帽的帽子" },
        { en: "elbow pads", ch: "护肘" },
        { en: "dragon horns", ch: "龙角" },
        { en: "eyewear on head", ch: "眼镜别在头上" },
        { en: "mole under mouth", ch: "嘴角有痣/美人痣" },
        { en: "x hair ornament", ch: "x发饰" },
        { en: "black hairband", ch: "黑色发带" },
        { en: "hair scrunchie", ch: "发箍" },
        { en: "white hairband", ch: "白色发带" },
        { en: "hair tie", ch: "发带" },
        { en: "frog hair ornament", ch: "青蛙发饰" },
        { en: "food-themed hair ornament", ch: "食物发饰" },
        { en: "star hair ornament", ch: "星星发饰" },
        { en: "heart hair ornament", ch: "心形发饰" },
        { en: "red hairband", ch: "红色发带" },
        { en: "butterfly hair ornament", ch: "蝴蝶发饰" },
        { en: "snake hair ornament", ch: "蛇发饰" },
        { en: "lolita hairband", ch: "洛丽塔发带" },
        { en: "feather hair ornament", ch: "羽毛头饰" },
        { en: "blue hairband", ch: "蓝色发带" },
        { en: "anchor hair ornament", ch: "锚发饰" },
        { en: "leaf hair ornament", ch: "叶发饰" },
        { en: "bunny hair ornament", ch: "兔子头饰" },
        { en: "skull hair ornament", ch: "骷髅头饰" },
        { en: "yellow hairband", ch: "黄色发带" },
        { en: "pink hairband", ch: "粉色发带" },
        { en: "bow hairband", ch: "蝴蝶结发带" },
        { en: "cat hair ornament", ch: "猫头饰" },
        { en: "musical note hair ornament", ch: "音符发饰" },
        { en: "carrot hair ornament", ch: "胡萝卜发饰" },
        { en: "purple hairband", ch: "紫色发带" },
        { en: "hair beads", ch: "发珠" },
        { en: "multiple hair bows", ch: "多个蝴蝶结" },
        { en: "bat hair ornament", ch: "蝙蝠发饰" },
        { en: "bone hair ornament", ch: "骨发饰" },
        { en: "orange hairband", ch: "橙色发带" },
        { en: "snowflake hair ornament", ch: "雪花发饰" },
        { en: "flower on head", ch: "头上有花" },
        { en: "head wreath", ch: "头上戴着花冠" }
      ]
    }]
  },
  {
    title: '构图',
    types: [{
      title: '形式',
      selections: [
        {
          en: "afterimage",
          ch: "残像"
        },
        {
          en: "border",
          ch: "边框"
        },
        {
          en: "framed",
          ch: "画框"
        },
        {
          en: "outside border",
          ch: "一部分画到了背景框外面"
        },
        {
          en: "fading border",
          ch: "褪色边框"
        },
        {
          en: "rounded corners",
          ch: "背景或画框是圆角"
        },
        {
          en: "viewfinder",
          ch: "相机取景框"
        },
        {
          en: "chart",
          ch: "图表"
        },
        {
          en: "character chart",
          ch: "人设图"
        },
        {
          en: "reference sheet",
          ch: "设定图"
        },
        {
          en: "diagram",
          ch: "图表"
        },
        {
          en: "move chart",
          ch: "动作演示图"
        },
        {
          en: "relationship graph",
          ch: "关系表"
        },
        {
          en: "seating chart",
          ch: "座次表"
        },
        {
          en: "stats",
          ch: "属性栏/状态表"
        },
        {
          en: "collage",
          ch: "拼贴画"
        },
        {
          en: "column lineup",
          ch: "小图拼接"
        },
        {
          en: "bust chart",
          ch: "胸围图"
        },
        {
          en: "cropped",
          ch: "遭到裁剪"
        },
        {
          en: "fake scrollbar",
          ch: "假的滚动条"
        },
        {
          en: "head out of frame",
          ch: "头部脱框"
        },
        {
          en: "out of frame",
          ch: "脱框"
        },
        {
          en: "feet out of frame",
          ch: "脚部脱框"
        },
        {
          en: "isometric",
          ch: "等轴"
        },
        {
          en: "letterboxed",
          ch: "宽银幕格式"
        },
        {
          en: "pillarboxed",
          ch: "柱状画布背景"
        },
        {
          en: "lineup",
          ch: "一排人"
        },
        {
          en: "mosaic art",
          ch: "马赛克艺术"
        },
        {
          en: "photomosaic",
          ch: "马赛克拼图"
        },
        {
          en: "negative space",
          ch: "大量留白"
        },
        {
          en: "omake",
          ch: "附图"
        },
        {
          en: "partially underwater shot",
          ch: "部分水下拍摄"
        },
        {
          en: "social media composition",
          ch: "社交媒体整合"
        },
        {
          en: "symmetry",
          ch: "左右对称"
        },
        {
          en: "polar opposites",
          ch: "两极对称"
        },
        {
          en: "rotational symmetry",
          ch: "对称旋转"
        },
        {
          en: "tachi-e",
          ch: "立绘样式"
        },
        {
          en: "trim marks",
          ch: "裁剪标记"
        },
        {
          en: "zoom layer",
          ch: "人物立绘缩放(剪影)图层"
        },
        {
          en: "projected inset",
          ch: "类似海报或杂志的插图效果"
        }
      ]

    }, {
      title: '镜头',
      selections: [
        {
          en: "lens flare",
          ch: "镜头光晕"
        },
        {
          en: "overexposure",
          ch: "过曝"
        },
        {
          en: "bokeh",
          ch: "背景散焦"
        },
        {
          en: "caustics",
          ch: "焦散"
        },
        {
          en: "diffraction spikes",
          ch: "衍射十字星"
        },
        {
          en: "foreshortening",
          ch: "正前缩距透视法"
        },
        {
          en: "emphasis lines",
          ch: "集中线"
        },
        {
          en: "satellite image",
          ch: "卫星鸟瞰"
        },
        {
          en: "macro photo",
          ch: "微距照片"
        },
        {
          en: "360 view",
          ch: "360 度视角"
        },
        {
          en: "Wide-Angle",
          ch: "广角"
        },
        {
          en: "Ultra-Wide Angle",
          ch: "超广角"
        },
        {
          en: "Eye-Level Shot",
          ch: "人眼视角拍摄"
        },
        {
          en: "f/1.2",
          ch: "光圈 F1.2"
        },
        {
          en: "f/1.8",
          ch: "光圈 F1.8"
        },
        {
          en: "f/2.8",
          ch: "光圈 F2.8"
        },
        {
          en: "f/4.0",
          ch: "光圈 F4.0"
        },
        {
          en: "f/16",
          ch: "光圈 F16"
        },
        {
          en: "35mm",
          ch: "焦距 35mm"
        },
        {
          en: "85mm",
          ch: "焦距 85mm"
        },
        {
          en: "135mm",
          ch: "焦距 135mm"
        },
        {
          en: "Nikon",
          ch: "尼康"
        },
        {
          en: "Canon",
          ch: "佳能"
        },
        {
          en: "Fujifilm",
          ch: "富士"
        },
        {
          en: "Hasselblad",
          ch: "哈苏"
        },
        {
          en: "Sony FE",
          ch: "索尼镜头"
        },
        {
          en: "Sony FE GM",
          ch: "索尼大师镜头"
        }
      ]
    }, {
      title: '视角',
      selections: [
        {
          en: "first-person view",
          ch: "第一人称视角"
        },
        {
          en: "pov",
          ch: "主观视角"
        },
        {
          en: "three sided view",
          ch: "三视图"
        },
        {
          en: "multiple views",
          ch: "多视图"
        },
        {
          en: "cut-in",
          ch: "插入画面"
        },
        {
          en: "blurry foreground",
          ch: "前景模糊"
        },
        {
          en: "close-up",
          ch: "特写镜头"
        },
        {
          en: "cowboy shot",
          ch: "七分身镜头"
        },
        {
          en: "dutch angle",
          ch: "德式倾斜镜头"
        },
        {
          en: "fisheye",
          ch: "鱼眼镜头"
        },
        {
          en: "hatching (texture)",
          ch: "线影法(纹理)"
        },
        {
          en: "vanishing point",
          ch: "远景透视画法"
        },
        {
          en: "wide shot",
          ch: "广角镜头"
        },
        {
          en: "from above",
          ch: "俯视镜头"
        },
        {
          en: "from behind",
          ch: "背影"
        },
        {
          en: "from below",
          ch: "仰视镜头"
        },
        {
          en: "from outside",
          ch: "室外看向室内(的镜头)"
        },
        {
          en: "from side",
          ch: "角色的侧面"
        },
        {
          en: "atmospheric perspective",
          ch: "大气距离感"
        },
        {
          en: "panorama",
          ch: "全景"
        },
        {
          en: "perspective",
          ch: "透视画法"
        },
        {
          en: "rotated",
          ch: "经过旋转的"
        },
        {
          en: "sideways",
          ch: "横向显示的"
        },
        {
          en: "upside-down",
          ch: "倒挂的"
        }
      ]

    }]
  },
  {
    title: '命令',
    types: [{
      title: '摄影测试模型',
      selections: [{
        en: '--testp',
        ch: '摄影测试模型'
      }]
    }, {
      title: '风格化',
      selections: [
        {
          en: "--stylize 0",
          ch: "风格化 0"
        },
        {
          en: "--stylize 500",
          ch: "风格化 500"
        },
        {
          en: "--stylize 1000",
          ch: "风格化 1000"
        }
      ]
    }, {
      title: '版本',
      selections: [
        {
          en: "--version 4",
          ch: "版本4"
        },
        {
          en: "--version 5",
          ch: "版本5"
        },
        {
          en: "--version niji",
          ch: "版本niji"
        }
      ]
    }, {
      title: '停止',
      selections: [
        {
          en: "--stop",
          ch: "停止"
        }
      ]
    }, {
      title: '动漫模型',
      selections: [
        {
          en: "--niji",
          ch: "动漫模型"
        }
      ]
    }, {
      title: '多样性',
      selections: [
        {
          en: "--chaos 0",
          ch: "多样性"
        },
        {
          en: "--chaos 50",
          ch: "多样性"
        },
        {
          en: "--chaos 100",
          ch: "多样性"
        }
      ]

    }, {
      title: '负面',
      selections: [
        {
          en: "--no xxx",
          ch: "负面"
        }
      ]
    }, {
      title: '重复',
      selections: [
        {
          en: "--repeat 1",
          ch: "重复 1"
        },
        {
          en: "--repeat 3",
          ch: "重复 3"
        }
      ]

    }, {
      title: '质量',
      selections: [
        {
          en: "--quality .25",
          ch: "质量 .25"
        },
        {
          en: "--quality .5",
          ch: "质量 .5"
        },
        {
          en: "--quality 1",
          ch: "质量 1"
        }
      ]
    }, {
      title: '高清模式',
      selections: [
        {
          en: "--hd",
          ch: "高清模型"
        }
      ]
    }, {
      title: '风格',
      selections: [
        {
          en: "Surrealism",
          ch: "超现实主义"
        },
        {
          en: "Color Field painting",
          ch: "色块画"
        },
        {
          en: "Art Deco",
          ch: "装饰艺术"
        },
        {
          en: "rococo style",
          ch: "洛可可风格"
        },
        {
          en: "high detail",
          ch: "高细节"
        },
        {
          en: "blind box toy style",
          ch: "盲盒玩具风格"
        },
        {
          en: "Cubist Futurism",
          ch: "立体派未来主义"
        },
        {
          en: "Conceptual art",
          ch: "概念艺术"
        },
        {
          en: "Futurism",
          ch: "未来主义"
        },
        {
          en: "Social realism",
          ch: "社会现实主义"
        },
        {
          en: "interior architecture",
          ch: "室内建筑"
        },
        {
          en: "Renaissance",
          ch: "文艺复兴"
        },
        {
          en: "Neoclassicism",
          ch: "新古典主义"
        },
        {
          en: "modern",
          ch: "现代"
        },
        {
          en: "anime",
          ch: "动漫"
        },
        {
          en: "Minimalism",
          ch: "极简主义"
        },
        {
          en: "Romanticism",
          ch: "浪漫主义"
        },
        {
          en: "Gothic art",
          ch: "哥特式艺术"
        },
        {
          en: "American propaganda poster",
          ch: "美国宣传海报"
        },
        {
          en: "Tonalism",
          ch: "色调主义"
        },
        {
          en: "Baroque",
          ch: "巴洛克"
        },
        {
          en: "Fauvism",
          ch: "野兽派"
        },
        {
          en: "Expressionism",
          ch: "表现主义"
        },
        {
          en: "Carl Larsson",
          ch: "卡尔·拉尔松风格的画作"
        },
        {
          en: "Op art",
          ch: "视错觉艺术"
        },
        {
          en: "Realism",
          ch: "现实主义"
        },
        {
          en: "Contemporary art",
          ch: "当代艺术"
        },
        {
          en: "Genre painting",
          ch: "风俗画"
        },
        {
          en: "Constructivism",
          ch: "构成主义"
        },
        {
          en: "Mannerism",
          ch: "后期文艺复兴"
        },
        {
          en: "Bauhaus",
          ch: "包豪斯"
        },
        {
          en: "Action painting",
          ch: "行动绘画"
        },
        {
          en: "by Alfons Mucha",
          ch: "由阿尔方斯·穆卡制作"
        },
        {
          en: "Dutch Golden Age painting",
          ch: "荷兰黄金时期绘画"
        },
        {
          en: "Pop art",
          ch: "波普艺术"
        },
        {
          en: "Monet",
          ch: "莫奈"
        },
        {
          en: "Northern Renaissance",
          ch: "北方文艺复兴"
        },
        {
          en: "Dadaism",
          ch: "达达主义"
        },
        {
          en: "Ukiyo-e",
          ch: "浮世绘"
        },
        {
          en: "Luminism",
          ch: "明亮主义"
        },
        {
          en: "Abstract expressionism",
          ch: "抽象表现主义"
        },
        {
          en: "Impressionism",
          ch: "印象派"
        },
        {
          en: "Pre-Raphaelite Brotherhood",
          ch: "前拉斐尔派兄弟会"
        },
        {
          en: "Classicism",
          ch: "古典主义"
        },
        {
          en: "Ghibli-like colours",
          ch: "吉卜力色彩"
        },
        {
          en: "Hyperrealism",
          ch: "超现实主义细节画派"
        },
        {
          en: "Art Nouveau",
          ch: "新艺术运动"
        },
        {
          en: "Suprematism",
          ch: "至高主义"
        },
        {
          en: "Abstractionism",
          ch: "抽象主义"
        },
        {
          en: "pre-rephaëlite painting",
          ch: "前拉斐尔派绘画"
        },
        {
          en: "anime style",
          ch: "动漫风格"
        },
        {
          en: "Post-Impressionism",
          ch: "后印象派"
        },
        {
          en: "En plein air",
          ch: "野外写生"
        },
        {
          en: "Pointillism",
          ch: "点彩派"
        },
        {
          en: "Verism",
          ch: "写实主义"
        },
        {
          en: "raised fist",
          ch: "扬起的拳头"
        },
        {
          en: "Ashcan School",
          ch: "垃圾桶派"
        },
        {
          en: "Pixar",
          ch: "皮克斯"
        },
        {
          en: "Cubism",
          ch: "立体主义"
        }
      ]
    }, {
      title: '图像权重',
      selections: [{
        en: "--iw",
        ch: "图像权重"
      }]
    }, {
      title: '测试模型',
      selections: [{
        en: "--test",
        ch: "测试模型"
      }]
    }, {
      title: '轻量放大器',
      selections: [{
        en: "--uplight",
        ch: "轻量放大器"
      }]
    }]
  },
]