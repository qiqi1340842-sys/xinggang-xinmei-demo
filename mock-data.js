/**
 * 新港集团新媒体数据中心 · 试点版 Demo 数据层
 * 试点范围: 机场路板块 · 2 网系 · 4 门店 · 6 主播 · 1 主管
 * 最小颗粒度: 主播 × 天 (T+1, 数据日 = 昨天)
 * 数据为演示数据(模拟), 框架定稿后接 IT 真实数据
 */
window.MOCK = (function () {
  'use strict';

  /* ---------------- 随机数 ---------------- */
  var _s = 20260823;
  function rng() {
    _s |= 0; _s = (_s + 0x6D2B79F5) | 0;
    var t = Math.imul(_s ^ (_s >>> 15), 1 | _s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function rand(min, max) { return min + rng() * (max - min); }

  /* ---------------- 基础档案 ---------------- */
  var BRANDS = [
    { id: 'wangchao', name: '王朝网' },
    { id: 'haiyang',  name: '海洋网' },
    { id: 'tengshi',  name: '腾势' },
    { id: 'fcbao',    name: '方程豹' }
  ];

  var STORES = [
    // ===== 王朝网(7家, 全成都) =====
    { id: 'wc_hwss',   name: '洪武盛世',     city: '成都', brand: 'wangchao', mgr: '董昊誉' },
    { id: 'wc_xghc',   name: '新港海川',     city: '成都', brand: 'wangchao', mgr: '董昊誉' },
    { id: 'wc_xgyc',   name: '新港永初',     city: '成都', brand: 'wangchao', mgr: '董昊誉' },
    { id: 'wc_xgxq',   name: '新港先秦',     city: '成都', brand: 'wangchao', mgr: '李璐' },
    { id: 'wc_xgzy',   name: '新港治元',     city: '成都', brand: 'wangchao', mgr: '李璐' },
    { id: 'wc_xgjl',   name: '新港建隆',     city: '成都', brand: 'wangchao', mgr: '纪海燕' },
    { id: 'wc_xgjy',   name: '新港建元',     city: '成都', brand: 'wangchao', mgr: '蒲霞' },
    // ===== 海洋网(11家) =====
    { id: 'hy_wjhy',   name: '文景海洋',     city: '成都', brand: 'haiyang',  mgr: '黄志豪' },
    { id: 'hy_wjss',   name: '文景盛世',     city: '成都', brand: 'haiyang',  mgr: '黄志豪' },
    { id: 'hy_syss',   name: '上元盛世',     city: '成都', brand: 'haiyang',  mgr: '董昊誉' },
    { id: 'hy_xglj',   name: '新港澜舰',     city: '成都', brand: 'haiyang',  mgr: '李璐' },
    { id: 'hy_xglk',   name: '新港澜阔',     city: '成都', brand: 'haiyang',  mgr: '黄剑' },
    { id: 'hy_xgkp',   name: '鑫港鲲鹏',     city: '成都', brand: 'haiyang',  mgr: '黄剑' },
    { id: 'hy_xgjw',   name: '新港建武',     city: '成都', brand: 'haiyang',  mgr: '蒲霞' },
    { id: 'hy_gzlx',   name: '贵州新港澜轩',  city: '贵阳', brand: 'haiyang',  mgr: '周发伦' },
    { id: 'hy_gzhl',   name: '贵州新港浩蓝',  city: '贵阳', brand: 'haiyang',  mgr: '周发伦' },
    { id: 'hy_gzhz',   name: '贵州新港海之辇', city: '贵阳', brand: 'haiyang', mgr: '周发伦' },
    { id: 'hy_gzwl',   name: '贵州新港蔚蓝',  city: '贵阳', brand: 'haiyang',  mgr: '周发伦' },
    // ===== 腾势(8家) =====
    { id: 'ts_syzx',   name: '上元臻享',     city: '成都', brand: 'tengshi',  mgr: '曾强' },
    { id: 'ts_syzz',   name: '上元臻智',     city: '成都', brand: 'tengshi',  mgr: '黄岭' },
    { id: 'ts_syzs',   name: '上元臻盛',     city: '成都', brand: 'tengshi',  mgr: '曾国祥' },
    { id: 'ts_syzh',   name: '上元臻和',     city: '成都', brand: 'tengshi',  mgr: '曾国祥' },
    { id: 'ts_ls',     name: '乐山上元臻智',  city: '乐山', brand: 'tengshi',  mgr: '王静' },
    { id: 'ts_yibin',  name: '宜宾上元臻智',  city: '宜宾', brand: 'tengshi',  mgr: '李福强' },
    { id: 'ts_mianyang', name: '绵阳新港鑫泽', city: '绵阳', brand: 'tengshi', mgr: '黄建波' },
    { id: 'ts_gz',     name: '贵州上元臻智',  city: '贵阳', brand: 'tengshi',  mgr: '陈金文' },
    // ===== 方程豹(19家, 已与IT对齐, itId=IT系统门店ID) =====
    { id: 'fb_xinghan', name: '上元星汉',    city: '成都', brand: 'fcbao',    mgr: '吴涛',   itId: 'org_fcb_shuangliu_xinghan' },
    { id: 'fb_kunling', name: '上元坤灵',    city: '成都', brand: 'fcbao',    mgr: '黄岭',   itId: 'org_fcb_shuangliu_kunling' },
    { id: 'fb_kunda',  name: '上元坤达',     city: '成都', brand: 'fcbao',    mgr: '刘海旭', itId: 'org_fcb_xindu_kunda' },
    { id: 'fb_kunyi',  name: '上元坤颐',     city: '成都', brand: 'fcbao',    mgr: '刘海旭', itId: 'org_fcb_pidu_kunyi' },
    { id: 'fb_huanji', name: '上元寰极',     city: '成都', brand: 'fcbao',    mgr: '刘海旭', itId: 'org_fcb_pengzhou_huanji' },
    { id: 'fb_hongchuan', name: '上元弘川',  city: '成都', brand: 'fcbao',    mgr: '纪海燕', itId: 'org_fcb_ximen_hongchuan' },
    { id: 'fb_kunlun', name: '上元昆仑',     city: '成都', brand: 'fcbao',    mgr: '刘海旭', itId: 'org_fcb_wenjiang_kunlun' },
    { id: 'fb_kuntai', name: '上元坤泰',     city: '成都', brand: 'fcbao',    mgr: '',       itId: 'org_fcb_wenjiang_kuntai' },
    { id: 'fb_xihe',   name: '上元曦和',     city: '成都', brand: 'fcbao',    mgr: '曾强',   itId: 'org_fcb_longtan_xihe' },
    { id: 'fb_tianhe', name: '新港天河',     city: '成都', brand: 'fcbao',    mgr: '蒲霞',   itId: 'org_fcb_longquan_tianhe' },
    { id: 'fb_lsxihe', name: '乐山上元曦和',  city: '乐山', brand: 'fcbao',    mgr: '王静',   itId: 'org_fcb_leshan_xihe' },
    { id: 'fb_yibin',  name: '宜宾上元曦和',  city: '宜宾', brand: 'fcbao',    mgr: '孙秀琼', itId: 'org_fcb_yibin_xihe' },
    { id: 'fb_luzhou', name: '泸州上元坤灵',  city: '泸州', brand: 'fcbao',    mgr: '汪珮芸', itId: 'org_fcb_luzhou_kunling' },
    { id: 'fb_gzkunling', name: '贵州上元坤灵', city: '贵阳', brand: 'fcbao', mgr: '',       itId: 'org_fcb_guizhou_kunling' },
    { id: 'fb_gzkunlun',  name: '贵州上元昆仑', city: '贵阳', brand: 'fcbao', mgr: '',       itId: 'org_fcb_guizhou_kunlun' },
    { id: 'fb_gzxihe', name: '贵州上元曦和',  city: '贵阳', brand: 'fcbao',    mgr: '',       itId: 'org_fcb_guizhou_xihe' },
    { id: 'fb_gzlx',   name: '贵州新港澜轩',  city: '贵阳', brand: 'fcbao',    mgr: '',       itId: 'org_fcb_guizhou_lanxuan' },
    { id: 'fb_gyxihe', name: '贵阳上元曦和',  city: '贵阳', brand: 'fcbao',    mgr: '黄楠',   itId: 'org_fcb_guiyang_xihe' },
    { id: 'fb_xizang', name: '西藏上元曦和',  city: '拉萨', brand: 'fcbao',    mgr: '',       itId: 'org_fcb_xizang_xihe' }
  ];

  // 真实主播名单(全部补齐)
  var anchorNames = {
    // 王朝网
    wc_hwss: ['李洁鑫', '吴婷'],
    wc_xghc: ['钟敬'],
    wc_xgyc: ['夏敏'],
    wc_xgxq: ['文静', '翁静蕾'],
    wc_xgzy: ['白兰雪'],
    wc_xgjl: ['袁馨怡', '彭娟'],
    wc_xgjy: ['何靓', '何婉卿', '蒙海梅'],
    // 海洋网
    hy_wjhy: ['吴思颖', '游宾宇'],
    hy_wjss: ['黄春作'],
    hy_syss: ['宫美琪', '杨滔滔'],
    hy_xglj: ['岳青青', '张敏'],
    hy_xglk: ['万昕灵', '袁利英'],
    hy_xgkp: ['陈佳玉'],
    hy_xgjw: ['陈渟', '石志纯', '张思羽'],
    hy_gzlx: ['冯立郡', '梁倩', '殷礼冰', '王佳'],
    hy_gzhl: ['郭云凤', '李华琴', '牟思蓉'],
    hy_gzhz: ['李黄芾祥'],
    hy_gzwl: ['王普庆', '朱茂'],
    // 腾势
    ts_syzx: ['李珏燕', '王梦'],
    ts_syzz: ['王丹', '彭星月'],
    ts_syzs: ['李彬伟', '李莉萍'],
    ts_syzh: ['龙昶利'],
    ts_ls: ['龚晓琴', '周洛稼'],
    ts_yibin: ['张耀文'],
    ts_mianyang: ['黄晓彤', '徐丽涵'],
    ts_gz: ['李璨'],
    // 方程豹(与IT对齐 2026-09-12, 含跨网系主播)
    fb_xinghan: ['喻攀', '田景燚'],
    fb_kunling: ['冉雨晨', '何娇', '夏敏'],
    fb_kunda: ['王一多'],
    fb_kunyi: ['任婉莹'],
    fb_huanji: ['徐露'],
    fb_hongchuan: ['付纯洁', '刘鑫雨'],
    fb_kunlun: ['江楠'],
    fb_kuntai: ['待补充'],
    fb_xihe: ['齐安', '骆姗', '张迪'],
    fb_tianhe: ['蒙海梅'],
    fb_lsxihe: ['甜甜', '知知'],
    fb_yibin: ['陈丽娟', '赵梦雪'],
    fb_luzhou: ['曾新', '马璐璐', '曾圆圆'],
    fb_gzkunling: ['待补充'],
    fb_gzkunlun: ['王宇'],
    fb_gzxihe: ['刘少华', '骆婷婷'],
    fb_gzlx: ['冯立郡', '梁倩', '王佳'],
    fb_gyxihe: ['何映竹', '张飞飞'],
    fb_xizang: ['待补充']
  };

  // 主播人设(按城市和网系给不同基数)
  var cityFactor = {
    '成都': 1.2, '乐山': 0.85, '泸州': 0.8,
    '宜宾': 0.75, '自贡': 0.7, '绵阳': 0.78, '贵阳': 0.7, '拉萨': 0.5
  };
  var brandFactor = {
    'wangchao': 1.0, 'haiyang': 1.1, 'tengshi': 0.75, 'fcbao': 0.7
  };

  var ANCHORS = [];
  var ai = 0;
  STORES.forEach(function (s) {
    var names = anchorNames[s.id] || ['主播甲', '主播乙'];
    var base = 25 * cityFactor[s.city] * brandFactor[s.brand];
    names.forEach(function (n, ni) {
      var diff = 0.85 + ni * 0.25; // 两主播差距
      var jitter = 0.9 + rng() * 0.2;
      ANCHORS.push({
        id: 'a' + ai,
        name: n,
        store: s.id,
        leadsBase: Math.max(8, Math.round(base * diff * jitter)),
        cpl: 115 + Math.round(rng() * 55),
        visitRate: 0.21 + rng() * 0.09,
        convRate: 0.052 + rng() * 0.028,
        dlvRate: 0.72 + rng() * 0.16,   // 订单到交车转化率
        hoursBase: 3.2 + rng() * 1.8,
        dlvCost: 1850 + Math.round(rng() * 650)
      });
      ai++;
    });
  });

  /* ---------------- 渠道定义 ---------------- */
  // 线索 8 渠道(展示时: 抖音=直播+短引直+短视频合并, 小红书分免费/付费)
  var LEAD_CHANNELS = [
    { key: 'zhibo',            name: '直播',       hasCost: true,  share: 0.45 },
    { key: 'duanyinzhi',       name: '短引直',     hasCost: true,  share: 0.25 },
    { key: 'duanshipin',       name: '抖音短视频', hasCost: true,  share: 0.15 },
    { key: 'shipinhao',        name: '视频号视频', hasCost: false, share: 0.06 },
    { key: 'xiaohongshu',      name: '小红书',     hasCost: false, share: 0.03 },
    { key: 'xiaohongshuFufei', name: '付费小红书', hasCost: true,  share: 0.03 },
    { key: 'xianyu',           name: '闲鱼',       hasCost: false, share: 0.015 },
    { key: 'kuaishou',         name: '快手',       hasCost: false, share: 0.015 }
  ];

  // 消耗 5 类型
  var COST_TYPES = [
    { key: 'zhiboZifei', name: '直播自费消耗' },
    { key: 'zhiboJili',  name: '直播厂家消耗' },
    { key: 'duanyinzhi', name: '短引直消耗' },
    { key: 'duanshipin', name: '抖音短视频消耗' },
    { key: 'xiaohongshuFufei', name: '付费小红书消耗' }
  ];

  var storeById = {};
  STORES.forEach(function (s) { s.anchors = []; storeById[s.id] = s; });
  ANCHORS.forEach(function (a) { storeById[a.store].anchors.push(a.id); });

  function anchorById(id) { return ANCHORS.filter(function (a) { return a.id === id; })[0]; }
  function brandById(id) { return BRANDS.filter(function (b) { return b.id === id; })[0]; }

  /* ---------------- 日期 (T+1, 固定参考日 8/29, 数据日 = 8/28) ---------------- */
  var DAYS = [];
  var _ref = new Date('2026-08-29T00:00:00');
  for (var i = 30; i >= 1; i--) {
    var d = new Date(_ref.getFullYear(), _ref.getMonth(), _ref.getDate() - i);
    DAYS.push({
      iso: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'),
      label: (d.getMonth() + 1) + '月' + d.getDate() + '日',
      weekend: (d.getDay() === 0 || d.getDay() === 6)
    });
  }
  var N = DAYS.length;

  /* ---------------- 生成主播×天明细 ---------------- */
  // rec[anchorId] = [{ date,label, leads{7}, leadsTotal, visits, orders, cost{4}, costTotal, hours, deliveryCost }]
  var rec = {};
  ANCHORS.forEach(function (a) {
    var arr = [];
    for (var di = 0; di < N; di++) {
      var wk = DAYS[di].weekend ? 1.22 : 1.0;              // 周末效应
      var trend = 1 + (di - N / 2) * 0.008;                // 缓慢增长趋势
      var wave = 0.78 + rng() * 0.44;                      // 日波动

      var leadsTotal = Math.max(3, Math.round(a.leadsBase * wk * trend * wave));

      // 8 渠道分配(最大余数法: 合计严格=总线索且小渠道不被吃掉)
      var leads = {};
      var exact = [];
      var floors = [];
      var floorSum = 0;
      for (var ci = 0; ci < LEAD_CHANNELS.length; ci++) {
        var w = LEAD_CHANNELS[ci].share * (0.85 + rng() * 0.3);
        exact.push(w);
      }
      var wSum = 0;
      exact.forEach(function (w) { wSum += w; });
      for (var ci = 0; ci < LEAD_CHANNELS.length; ci++) {
        var e = leadsTotal * exact[ci] / wSum;
        var f = Math.floor(e);
        floors.push({ key: LEAD_CHANNELS[ci].key, floor: f, frac: e - f });
        floorSum += f;
      }
      // 剩余额度按小数部分从大到小补 1
      var remain = leadsTotal - floorSum;
      floors.sort(function (a, b) { return b.frac - a.frac; });
      for (var ri = 0; ri < remain && ri < floors.length; ri++) floors[ri].floor += 1;
      floors.forEach(function (x) { leads[x.key] = x.floor; });

      // 消耗: 按渠道线索 × 渠道CPL, 直播拆自费/厂家(约6:4)
      var zbCost = Math.round(leads.zhibo * 118 * (0.9 + rng() * 0.2));
      var cost = {
        zhiboZifei: Math.round(zbCost * 0.6),
        zhiboJili: Math.round(zbCost * 0.4),
        duanyinzhi: Math.round(leads.duanyinzhi * 100 * (0.9 + rng() * 0.2)),
        duanshipin: Math.round(leads.duanshipin * 112 * (0.9 + rng() * 0.2)),
        xiaohongshuFufei: Math.round(leads.xiaohongshuFufei * 150 * (0.9 + rng() * 0.2))
      };
      var costTotal = cost.zhiboZifei + cost.zhiboJili + cost.duanyinzhi + cost.duanshipin + cost.xiaohongshuFufei;

      // 到店/订单/交车/时长/交车成本
      var visits = Math.round(leadsTotal * a.visitRate * (0.8 + rng() * 0.4));
      var orders = Math.max(0, Math.round(leadsTotal * a.convRate * (0.7 + rng() * 0.6)));
      if (orders > visits) orders = visits;
      var deliveries = Math.max(0, Math.round(orders * a.dlvRate * (0.8 + rng() * 0.4)));
      if (deliveries > orders) deliveries = orders;
      var hours = Math.round(a.hoursBase * (0.85 + rng() * 0.3) * 10) / 10;
      var deliveryCost = Math.round(a.dlvCost * (0.92 + rng() * 0.16));

      arr.push({
        date: DAYS[di].iso, label: DAYS[di].label,
        leads: leads, leadsTotal: leadsTotal,
        visits: visits, orders: orders, deliveries: deliveries,
        cost: cost, costTotal: costTotal,
        hours: hours, deliveryCost: deliveryCost
      });
    }
    rec[a.id] = arr;
  });

  /* ---------------- 聚合 ---------------- */
  function emptyAgg() {
    return {
      leads: { zhibo: 0, duanyinzhi: 0, duanshipin: 0, shipinhao: 0, xiaohongshu: 0, xiaohongshuFufei: 0, xianyu: 0, kuaishou: 0 },
      leadsTotal: 0, visits: 0, orders: 0, deliveries: 0,
      cost: { zhiboZifei: 0, zhiboJili: 0, duanyinzhi: 0, duanshipin: 0, xiaohongshuFufei: 0 }, costTotal: 0,
      hours: 0,
      cpl: 0, orderCost: 0, deliveryCost: 0,
      visitRate: 0, convRate: 0, deliveryRate: 0, orderDeliveryRate: 0,
      leadsPerHour: 0
    };
  }

  function addInto(acc, r) {
    LEAD_CHANNELS.forEach(function (c) { acc.leads[c.key] += r.leads[c.key] || 0; });
    acc.leadsTotal += r.leadsTotal;
    acc.visits += r.visits;
    acc.orders += r.orders;
    acc.deliveries += r.deliveries;
    COST_TYPES.forEach(function (c) { acc.cost[c.key] += r.cost[c.key] || 0; });
    acc.costTotal += r.costTotal;
    acc.hours += r.hours;
    return acc;
  }

  function withDerived(acc) {
    acc.cpl = acc.leadsTotal ? Math.round(acc.costTotal / acc.leadsTotal) : 0;
    acc.orderCost = acc.orders ? Math.round(acc.costTotal / acc.orders) : 0;
    acc.deliveryCost = acc.deliveries ? Math.round(acc.costTotal / acc.deliveries) : 0;
    acc.visitRate = acc.leadsTotal ? acc.visits / acc.leadsTotal : 0;
    acc.convRate = acc.leadsTotal ? acc.orders / acc.leadsTotal : 0;
    acc.deliveryRate = acc.leadsTotal ? acc.deliveries / acc.leadsTotal : 0;
    acc.orderDeliveryRate = acc.orders ? acc.deliveries / acc.orders : 0;
    acc.leadsPerHour = acc.hours ? Math.round(acc.leadsTotal / acc.hours * 10) / 10 : 0;
    acc.hours = Math.round(acc.hours * 10) / 10;
    return acc;
  }

  function aggRange(aids, from, to) {
    var acc = emptyAgg();
    aids.forEach(function (aid) {
      for (var d = from; d <= to; d++) addInto(acc, rec[aid][d]);
    });
    return withDerived(acc);
  }

  // period: 'today' = 最新数据日(昨天) / 'week' = 近7天 / 'month' = 近30天
  function rangeOf(period) {
    var last = N - 1; // 昨天(数据最后一天)
    var lastDate = new Date(DAYS[last].iso);
    if (period === 'week') {
      // 自然周: 本周一到昨天
      var dow = lastDate.getDay(); // 0=周日, 1=周一, ..., 6=周六
      var daysFromMonday = dow === 0 ? 6 : dow - 1; // 周一到昨天差几天
      return [last - daysFromMonday, last];
    }
    if (period === 'month') {
      // 自然月: 本月1号到昨天
      var dayOfMonth = lastDate.getDate(); // 1-31
      return [last - (dayOfMonth - 1), last];
    }
    return [last, last]; // today = 昨天
  }

  // 返回周期信息: 天数 + 文字标签
  function periodInfo(period) {
    if (period === 'today') return { days: 1, label: '昨日' };
    var r = rangeOf(period);
    var days = r[1] - r[0] + 1;
    if (period === 'week') return { days: days, label: '本周以来' };
    if (period === 'month') return { days: days, label: '本月以来' };
    return { days: days, label: '' };
  }

  // 月度按周拆分(用于周度环比)
  function monthWeekBreakdown(scope) {
    var r = rangeOf('month');
    var from = r[0], to = r[1];
    var weeks = [];
    var curStart = from;
    while (curStart <= to) {
      // 找到这周的周一对应的日期
      var d = new Date(DAYS[curStart].iso);
      var dow = d.getDay(); // 0=周日
      var daysFromMonday = dow === 0 ? 6 : dow - 1;
      var weekEnd = Math.min(curStart + (6 - daysFromMonday), to);
      // 聚合这周数据
      var aids;
      if (scope && scope.storeId) aids = anchorsOfStore(scope.storeId);
      else if (scope && scope.brandId) aids = anchorsOfBrand(scope.brandId);
      else aids = allAnchorIds();
      var wagg = aggRange(aids, curStart, weekEnd);
      var weekNum = weeks.length + 1;
      // 生成周标签(用起止日期)
      var startLabel = DAYS[curStart].label;
      var endLabel = DAYS[weekEnd].label;
      weeks.push({
        label: '第' + weekNum + '周',
        sub: startLabel + '~' + endLabel,
        leadsTotal: wagg.leadsTotal,
        visits: wagg.visits,
        orders: wagg.orders,
        deliveries: wagg.deliveries,
        costTotal: wagg.costTotal,
        convRate: wagg.convRate,
        deliveryRate: wagg.deliveryRate
      });
      curStart = weekEnd + 1;
    }
    return weeks;
  }

  // 手动更新的周度/月度分析数据(运营主管每周一提供)
  var MANUAL_WEEK = {
    updatedAt: '—',
    periodLabel: '本周',
    channels: null,
    cost: null,
    highlights: ['📝 周度数据待运营主管更新（每周一提供）']
  };

  var MANUAL_MONTH = {
    updatedAt: '—',
    periodLabel: '本月',
    channels: null,
    cost: null,
    highlights: ['📝 月度数据待运营主管更新（每月初提供）']
  };

  function anchorsOfStore(storeId) { return storeById[storeId].anchors; }
  function anchorsOfBrand(brandId) {
    var ids = [];
    STORES.forEach(function (s) { if (s.brand === brandId) ids = ids.concat(s.anchors); });
    return ids;
  }
  function allAnchorIds() { return ANCHORS.map(function (a) { return a.id; }); }

  function anchorAgg(anchorId, period) {
    var r = rangeOf(period);
    return aggRange([anchorId], r[0], r[1]);
  }
  function storeAgg(storeId, period) {
    var r = rangeOf(period);
    return aggRange(anchorsOfStore(storeId), r[0], r[1]);
  }
  function brandAgg(brandId, period) {
    var r = rangeOf(period);
    return aggRange(anchorsOfBrand(brandId), r[0], r[1]);
  }
  function groupAgg(period) {
    var r = rangeOf(period);
    return aggRange(allAnchorIds(), r[0], r[1]);
  }

  /* ---------------- 趋势序列 ---------------- */
  function seriesOf(aids) {
    var out = [];
    for (var d = 0; d < N; d++) {
      var acc = emptyAgg();
      aids.forEach(function (aid) { addInto(acc, rec[aid][d]); });
      var o = withDerived(acc);
      o.date = DAYS[d].iso;
      o.label = DAYS[d].label;
      out.push(o);
    }
    return out;
  }
  function anchorSeries(id) { return seriesOf([id]); }
  function storeSeries(id) { return seriesOf(anchorsOfStore(id)); }
  function brandSeries(id) { return seriesOf(anchorsOfBrand(id)); }
  function groupSeries() { return seriesOf(allAnchorIds()); }

  /* ---------------- AI 洞察 ---------------- */
  // 生成网系/板块级 AI 概览
  function buildOverview(brandId, period) {
    var stores = STORES.filter(function (s) { return !brandId || s.brand === brandId; });
    var total;
    if (brandId) total = brandAgg(brandId, period);
    else total = groupAgg(period);

    // 昨日 vs 前一日环比(仅 today 有意义)
    var prev = null, change = {};
    if (period === 'today') {
      var prevRange = [N - 2, N - 2];
      var aids = [];
      stores.forEach(function (s) { aids = aids.concat(s.anchors); });
      prev = aggRange(aids, prevRange[0], prevRange[1]);
      change.leads = total.leadsTotal - prev.leadsTotal;
      change.leadsPct = prev.leadsTotal ? change.leads / prev.leadsTotal : 0;
      change.orders = total.orders - prev.orders;
      change.ordersPct = prev.orders ? change.orders / prev.orders : 0;
      change.visits = total.visits - prev.visits;
      change.visitsPct = prev.visits ? change.visits / prev.visits : 0;
    }

    // 各门店数据
    var storeStats = stores.map(function (s) {
      return { store: s, t: storeAgg(s.id, period) };
    });

    // 冠军
    var leadsChamp = storeStats.slice().sort(function(a,b){ return b.t.leadsTotal - a.t.leadsTotal; })[0];
    var ordersChamp = storeStats.slice().sort(function(a,b){ return b.t.orders - a.t.orders; })[0];
    var dlvChamp = storeStats.slice().sort(function(a,b){ return b.t.deliveries - a.t.deliveries; })[0];
    var convChamp = storeStats.slice().sort(function(a,b){ return b.t.convRate - a.t.convRate; })[0];
    var cplChamp = storeStats.slice().filter(function(x){ return x.t.cpl > 0; }).sort(function(a,b){ return a.t.cpl - b.t.cpl; })[0];

    // 垫底
    var leadsBottom = storeStats.slice().sort(function(a,b){ return a.t.leadsTotal - b.t.leadsTotal; })[0];
    var ordersBottom = storeStats.slice().sort(function(a,b){ return a.t.orders - b.t.orders; })[0];
    var dlvBottom = storeStats.slice().sort(function(a,b){ return a.t.deliveries - b.t.deliveries; })[0];
    var convBottom = storeStats.slice().sort(function(a,b){ return a.t.convRate - b.t.convRate; })[0];
    var cplBottom = storeStats.slice().filter(function(x){ return x.t.cpl > 0; }).sort(function(a,b){ return b.t.cpl - a.t.cpl; })[0];

    // 渠道洞察(昨日 vs 周均)
    var channelInsights = [];
    if (period === 'today') {
      var wk = brandId ? brandAgg(brandId, 'week') : groupAgg('week');
      var wkAvg = function(key) { return wk.leads[key] / 7; };
      // 找涨幅最大的渠道
      var maxChg = { key: '', pct: -999 };
      LEAD_CHANNELS.forEach(function(c){
        var avg = wkAvg(c.key);
        if (avg > 2) {
          var chg = (total.leads[c.key] - avg) / avg;
          if (chg > maxChg.pct) maxChg = { key: c.key, name: c.name, pct: chg, val: total.leads[c.key], avg: avg };
        }
      });
      if (maxChg.key) {
        var dir = maxChg.pct >= 0 ? '增长' : '下滑';
        channelInsights.push(maxChg.name + '昨日' + maxChg.val + '条，较周均' + dir + Math.abs(Math.round(maxChg.pct*100)) + '%');
      }
      // 免费渠道合计
      var freeTotal = total.leads.shipinhao + total.leads.xiaohongshu + total.leads.xianyu + total.leads.kuaishou;
      var freePct = total.leadsTotal ? freeTotal / total.leadsTotal : 0;
      if (freeTotal > 0) {
        channelInsights.push('免费渠道(视频号/小红书等)贡献' + freeTotal + '条，占比' + Math.round(freePct*100) + '%');
      }
      // 短视频投流效果
      var shortTotal = total.leads.duanshipin + total.leads.duanyinzhi;
      var shortCost = total.cost.duanshipin + total.cost.duanyinzhi;
      if (shortTotal > 5) {
        var shortCpl = Math.round(shortCost / shortTotal);
        channelInsights.push('短视频投流(短引直+短视频)线索' + shortTotal + '条，CPL约¥' + shortCpl);
      }
    }

    // 异常检测
    var anomalies = [];
    if (period === 'today') {
      storeStats.forEach(function (x) {
        var prevS = storeAgg(x.store.id, 'today');
        // 对比 7 日均值
        var wk = storeAgg(x.store.id, 'week');
        var avgLeads = wk.leadsTotal / 7;
        if (avgLeads > 5 && x.t.leadsTotal < avgLeads * 0.6) {
          anomalies.push({ level: 'warn', store: x.store.name, type: '线索下滑', msg: x.store.name + '线索' + x.t.leadsTotal + '条，低于周均' + Math.round(avgLeads) + '条，建议关注' });
        }
        var avgOrders = wk.orders / 7;
        if (avgOrders > 0.5 && x.t.orders < avgOrders * 0.5) {
          anomalies.push({ level: 'warn', store: x.store.name, type: '成交下滑', msg: x.store.name + '成交' + x.t.orders + '台，低于周均' + (avgOrders.toFixed(1)) + '台' });
        }
        // 直播时长异常
        var avgH = wk.hours / 7;
        if (avgH > 2 && x.t.hours < avgH * 0.6) {
          anomalies.push({ level: 'info', store: x.store.name, type: '直播时长', msg: x.store.name + '直播时长' + x.t.hours + 'h，低于周均' + avgH.toFixed(1) + 'h' });
        }
      });
    }

    // 一句话总结
    var summary = '';
    var periodLabel = '昨日';
    if (period === 'week') periodLabel = '本周以来';
    if (period === 'month') periodLabel = '本月以来';

    if (period === 'today' && prev) {
      var leadsDir = change.leadsPct >= 0 ? '增长' : '下滑';
      var ordersDir = change.ordersPct >= 0 ? '增长' : '下滑';
      summary = '昨日线索' + total.leadsTotal + '条，环比' + leadsDir + Math.abs(Math.round(change.leadsPct * 100)) + '%；' +
                '成交' + total.orders + '台，环比' + ordersDir + Math.abs(Math.round(change.ordersPct * 100)) + '%。';
      if (anomalies.length > 0) {
        summary += '有' + anomalies.length + '项异常需关注。';
      } else {
        summary += '整体运行平稳。';
      }
    }

    // ===== AI 分析(周/月用，3-4条核心洞察) =====
    var aiAnalysis = [];
    if (period !== 'today') {
      // 1. 整体表现
      aiAnalysis.push(periodLabel + '累计订单 ' + total.orders + ' 台，线索 ' + total.leadsTotal + ' 条，线索转化率 ' + (total.convRate*100).toFixed(1) + '%。');

      // 2. 趋势判断(最近3天 vs 前3天)
      var r = rangeOf(period);
      var totalDays = r[1] - r[0] + 1;
      if (totalDays >= 5) {
        var aids = [];
        stores.forEach(function (s) { aids = aids.concat(s.anchors); });
        var recent3 = aggRange(aids, r[1] - 2, r[1]);
        var prev3 = aggRange(aids, r[1] - 5, r[1] - 3);
        if (prev3.orders > 0) {
          var trendPct = (recent3.orders - prev3.orders) / prev3.orders;
          var trendDir = trendPct >= 0 ? '上升' : '下滑';
          aiAnalysis.push('最近3天日均订单 ' + (recent3.orders/3).toFixed(1) + ' 台，较前3天' + trendDir + ' ' + Math.abs(Math.round(trendPct*100)) + '%。');
        }
      }

      // 3. 渠道亮点
      var freeTotal = total.leads.shipinhao + total.leads.xiaohongshu + total.leads.xianyu + total.leads.kuaishou;
      var freePct = total.leadsTotal ? freeTotal / total.leadsTotal : 0;
      if (freePct > 0.1) {
        // 找免费渠道里做得最好的门店
        var bestFreeStore = null, bestFreeVal = 0;
        storeStats.forEach(function (x) {
          var fv = (x.t.leads.shipinhao||0) + (x.t.leads.xiaohongshu||0) + (x.t.leads.xianyu||0) + (x.t.leads.kuaishou||0);
          if (fv > bestFreeVal) { bestFreeVal = fv; bestFreeStore = x.store.name; }
        });
        if (bestFreeStore) {
          aiAnalysis.push('免费渠道贡献占比 ' + Math.round(freePct*100) + '%，' + bestFreeStore + ' 做得最好(' + bestFreeVal + '条)，值得分享经验。');
        }
      }

      // 4. 转化亮点/问题
      var bestConv = convChamp;
      var worstConv = convBottom;
      if (bestConv && worstConv && bestConv.t.convRate - worstConv.t.convRate > 0.03) {
        aiAnalysis.push('门店转化差异大，最高 ' + bestConv.store.name + '(' + (bestConv.t.convRate*100).toFixed(1) + '%) vs 最低 ' + worstConv.store.name + '(' + (worstConv.t.convRate*100).toFixed(1) + '%)，建议后者主管盯紧后链路。');
      }
    }

    // 渠道洞察(周/月也生成)
    if (period !== 'today') {
      // 各渠道贡献占比
      var maxCh = { key: '', val: 0 };
      LEAD_CHANNELS.forEach(function (c) {
        var v = total.leads[c.key] || 0;
        if (v > maxCh.val) maxCh = { key: c.key, name: c.name, val: v };
      });
      if (maxCh.key) {
        var mp = total.leadsTotal ? maxCh.val / total.leadsTotal : 0;
        channelInsights.push(maxCh.name + '贡献最大，' + maxCh.val + '条，占比' + Math.round(mp*100) + '%');
      }
      // 免费渠道
      if (freeTotal > 0) {
        channelInsights.push('免费渠道(视频号/小红书/闲鱼/快手)共' + freeTotal + '条，占比' + Math.round(freePct*100) + '%');
      }
      // 短视频投流CPL
      var shortTotal = total.leads.duanshipin + total.leads.duanyinzhi;
      var shortCost = total.cost.duanshipin + total.cost.duanyinzhi;
      if (shortTotal > 5) {
        var shortCpl = Math.round(shortCost / shortTotal);
        channelInsights.push('短视频投流(短引直+短视频) ' + shortTotal + ' 条，CPL 约 ¥' + shortCpl);
      }
    }

    return {
      total: total,
      summary: summary,
      aiAnalysis: aiAnalysis,
      periodLabel: periodLabel,
      change: change,
      champs: {
        leads: leadsChamp,
        orders: ordersChamp,
        deliveries: dlvChamp,
        conv: convChamp,
        cpl: cplChamp
      },
      worst: {
        leads: leadsBottom,
        orders: ordersBottom,
        deliveries: dlvBottom,
        conv: convBottom,
        cpl: cplBottom
      },
      channelInsights: channelInsights,
      anomalies: anomalies.slice(0, 4),
      storeStats: storeStats
    };
  }

  // 辅助: money
  function money(v) { return '¥' + Math.round(v).toLocaleString(); }

  /* ---------------- 排名 ---------------- */
  function storeRanking(brandId, period) {
    var list = STORES.filter(function (s) { return !brandId || s.brand === brandId; }).map(function (s) {
      return { store: s, t: storeAgg(s.id, period) };
    });
    list.sort(function (a, b) { return b.t.leadsTotal - a.t.leadsTotal; });
    return list;
  }
  function anchorRanking(filter, period) {
    var list = ANCHORS.filter(function (a) {
      if (filter.storeId) return a.store === filter.storeId;
      if (filter.brandId) return storeById[a.store].brand === filter.brandId;
      return true;
    }).map(function (a) {
      return { anchor: a, store: storeById[a.store], t: anchorAgg(a.id, period) };
    });
    list.sort(function (a, b) { return b.t.leadsTotal - a.t.leadsTotal; });
    return list;
  }

  /* ---------------- 导出 ---------------- */
  return {
    BRANDS: BRANDS, STORES: STORES, ANCHORS: ANCHORS,
    LEAD_CHANNELS: LEAD_CHANNELS, COST_TYPES: COST_TYPES,
    DAYS: DAYS, N: N,
    todayLabel: DAYS[N - 1].label,
    demoTodayLabel: '8月29日',
    periodInfo: periodInfo,
    storeById: storeById, brandById: brandById, anchorById: anchorById,
    anchorsOfStore: function (id) { return ANCHORS.filter(function (a) { return a.store === id; }); },
    storesOfBrand: function (id) { return STORES.filter(function (s) { return s.brand === id; }); },
    anchorAgg: anchorAgg, storeAgg: storeAgg, brandAgg: brandAgg, groupAgg: groupAgg,
    anchorSeries: anchorSeries, storeSeries: storeSeries, brandSeries: brandSeries, groupSeries: groupSeries,
    storeRanking: storeRanking, anchorRanking: anchorRanking,
    buildOverview: buildOverview,
    monthWeekBreakdown: monthWeekBreakdown,
    manualWeek: MANUAL_WEEK,
    manualMonth: MANUAL_MONTH
  };
})();
