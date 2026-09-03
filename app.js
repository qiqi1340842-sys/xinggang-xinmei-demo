/* 新港集团新媒体数据中心 · 试点版 Demo(纯前端,无后端)
 * 页面层级: 板块总览 → 网系 → 门店 → 主播
 * 总览/网系: 总览 / 周度分析 / 月度分析 (三观)
 * 门店/主播: 昨日 / 本周 / 本月 (时间切换)
 */
(function () {
  'use strict';
  var M = window.MOCK;

  /* ---------------- 格式化 ---------------- */
  function money(v) { return '¥' + Math.round(v).toLocaleString(); }
  function num(v) { return Math.round(v).toLocaleString(); }
  function pct(v) { return (v * 100).toFixed(1) + '%'; }
  function hoursFmt(v) { return (Math.round(v * 10) / 10) + 'h'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------------- 路由 ---------------- */
  window.go = function (hash) { location.hash = hash; };
  function parseHash() {
    var h = location.hash.replace(/^#/, '');
    var qi = h.indexOf('?');
    var path = qi >= 0 ? h.slice(0, qi) : h;
    var query = {};
    if (qi >= 0) {
      h.slice(qi + 1).split('&').forEach(function (kv) {
        var p = kv.split('=');
        if (p[0]) query[p[0]] = decodeURIComponent(p[1] || '');
      });
    }
    return { path: path, query: query };
  }

  /* ---------------- 公共组件 ---------------- */
  function topbar() {
    return '<div class="topbar"><div class="logo">新港</div>' +
      '<div class="title">新媒体数据中心</div>' +
      '<div class="date">今天 ' + M.demoTodayLabel + '<br>数据日期:' + M.todayLabel + ' · 9:00同步</div></div>';
  }

  function navbar(active) {
    var pills = '<div class="pill' + (!active ? ' active' : '') + '" onclick="go(\'\')">集团总览</div>';
    M.BRANDS.forEach(function (b) {
      pills += '<div class="pill' + (active === b.id ? ' active' : '') + '" onclick="go(\'/brand/' + b.id + '\')">' + b.name + '</div>';
    });
    return '<div class="brandbar">' + pills + '</div>';
  }

  // 三观切换: 总览 / 周度分析 / 月度分析 (用于总览页/网系页)
  function viewSwitch(cur, baseHash) {
    var defs = [['overview', '总览'], ['week', '周度分析'], ['month', '月度分析']];
    var sep = baseHash.indexOf('?') >= 0 ? '&' : '?';
    return '<div class="view-switch">' + defs.map(function (d) {
      return '<div class="v' + (cur === d[0] ? ' active' : '') + '" onclick="go(\'' + baseHash + sep + 'view=' + d[0] + '\')">' + d[1] + '</div>';
    }).join('') + '</div>';
  }

  // 网系内部导航: 总览 + 各门店 + 周度分析 + 月度分析
  function brandInnerNav(brandId, curView) {
    var stores = M.storesOfBrand(brandId);
    var items = [];
    items.push({ key: 'overview', label: '总览', type: 'view' });
    stores.forEach(function (s) {
      items.push({ key: s.id, label: s.name, type: 'store' });
    });
    items.push({ key: 'week', label: '周度分析', type: 'view' });
    items.push({ key: 'month', label: '月度分析', type: 'view' });

    return '<div class="brand-inner-nav">' + items.map(function (it) {
      var isActive = (it.type === 'view' && curView === it.key);
      var cls = 'bin' + (isActive ? ' active' : '') + (it.type === 'store' ? ' store-link' : '');
      var onclick;
      if (it.type === 'view') {
        onclick = 'go(\'/brand/' + brandId + '?view=' + it.key + '\')';
      } else {
        onclick = 'go(\'/store/' + it.key + '\')';
      }
      return '<div class="' + cls + '" onclick="' + onclick + '">' + it.label + '</div>';
    }).join('') + '</div>';
  }

  // 时间切换: 昨日 / 本周 / 本月 (用于门店页/主播页)
  function periodSwitch(cur, baseHash) {
    var defs = [['today', '昨日'], ['week', '本周'], ['month', '本月']];
    var sep = baseHash.indexOf('?') >= 0 ? '&' : '?';
    return '<div class="period-switch">' + defs.map(function (d) {
      return '<div class="p' + (cur === d[0] ? ' active' : '') + '" onclick="go(\'' + baseHash + sep + 'period=' + d[0] + '\')">' + d[1] + '</div>';
    }).join('') + '</div>';
  }

  function kpiStrip(items) {
    return '<div class="kpi-strip">' + items.map(function (it) {
      return '<div class="kpi"><div class="k-label">' + it.label + '</div>' +
        '<div class="k-val">' + it.value + (it.unit ? '<small>' + it.unit + '</small>' : '') + '</div></div>';
    }).join('') + '</div>';
  }

  // AI 概览卡片
  function aiOverview(ov) {
    var champs = ov.champs;
    var worst = ov.worst;
    var view = ov.view || 'overview';
    var isToday = view === 'overview';
    var starTitle = isToday ? '🏆 昨日之星' : '⭐ 门店之星';
    var warnTitle = isToday ? '⚠️ 需关注' : '⚠️ 排名垫底';

    var html = '<div class="ai-card">' +
      '<div class="ai-header"><span class="ai-avatar">🤖</span><div class="ai-title">AI 数据参谋</div></div>';

    // AI 分析(周/月才有，放最前面)
    if (ov.aiAnalysis && ov.aiAnalysis.length) {
      html += '<div class="ai-section"><div class="ai-sec-title">💡 AI 分析</div><div class="ai-alerts">';
      ov.aiAnalysis.forEach(function (s, i) {
        html += '<div class="ai-alert info"><b>' + (i+1) + '.</b> ' + s + '</div>';
      });
      html += '</div></div>';
    }

    // 冠军 + 垫底 两列并排
    html += '<div class="ai-two-col">';
    html += '<div class="ai-section"><div class="ai-sec-title">' + starTitle + '</div><div class="ai-champs">';
    html += '<div class="ai-champ"><span class="ai-c-label">线索最高</span><b>' + champs.leads.store.name + '</b><small>' + champs.leads.t.leadsTotal + ' 条</small></div>';
    html += '<div class="ai-champ"><span class="ai-c-label">成交最高</span><b>' + champs.orders.store.name + '</b><small>' + champs.orders.t.orders + ' 台</small></div>';
    html += '<div class="ai-champ"><span class="ai-c-label">转化最高</span><b>' + champs.conv.store.name + '</b><small>' + pct(champs.conv.t.convRate) + '</small></div>';
    html += '<div class="ai-champ"><span class="ai-c-label">成本最优</span><b>' + champs.cpl.store.name + '</b><small>' + money(champs.cpl.t.cpl) + '</small></div>';
    html += '</div></div>';

    if (worst) {
      html += '<div class="ai-section"><div class="ai-sec-title">' + warnTitle + '</div><div class="ai-champs">';
      html += '<div class="ai-champ warn"><span class="ai-c-label">线索垫底</span><b>' + worst.leads.store.name + '</b><small>' + worst.leads.t.leadsTotal + ' 条</small></div>';
      html += '<div class="ai-champ warn"><span class="ai-c-label">成交最低</span><b>' + worst.orders.store.name + '</b><small>' + worst.orders.t.orders + ' 台</small></div>';
      html += '<div class="ai-champ warn"><span class="ai-c-label">转化最低</span><b>' + worst.conv.store.name + '</b><small>' + pct(worst.conv.t.convRate) + '</small></div>';
      html += '<div class="ai-champ warn"><span class="ai-c-label">成本最高</span><b>' + worst.cpl.store.name + '</b><small>' + money(worst.cpl.t.cpl) + '</small></div>';
      html += '</div></div>';
    }
    html += '</div>';

    // 渠道洞察
    if (ov.channelInsights && ov.channelInsights.length) {
      html += '<div class="ai-section"><div class="ai-sec-title">📊 渠道洞察</div><div class="ai-alerts">';
      ov.channelInsights.forEach(function (s) {
        html += '<div class="ai-alert info">' + s + '</div>';
      });
      html += '</div></div>';
    }

    // 异常预警(只有昨日有)
    if (isToday && ov.anomalies && ov.anomalies.length) {
      html += '<div class="ai-section"><div class="ai-sec-title">🚨 异常预警 (' + ov.anomalies.length + ')</div><div class="ai-alerts">';
      ov.anomalies.forEach(function (a) {
        html += '<div class="ai-alert ' + a.level + '">' + a.msg + '</div>';
      });
      html += '</div></div>';
    }

    html += '</div>';
    return html;
  }

  // 图表渲染
  var _charts = [];
  function chartPlaceholder(id, title) {
    return '<div class="section-title">' + title + '</div><div class="card"><div id="' + id + '" style="height:260px"></div></div>';
  }

  // 生成 7 张单渠道门店对比图
  function buildChannelCharts(prefix, storeStats) {
    var colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    var html = '<div class="section-title">线索渠道 · 门店对比</div>';
    var charts = [];
    M.LEAD_CHANNELS.forEach(function (c, i) {
      var id = prefix + 'ch' + i;
      html += '<div class="card"><div id="' + id + '" style="height:220px"></div></div>';
      charts.push({
        type: 'singleChannel',
        id: id,
        data: { storeStats: storeStats, key: c.key, name: c.name, color: colors[i] }
      });
    });
    return { html: html, charts: charts };
  }
  function renderChart(id, option) {
    var el = document.getElementById(id);
    if (!el || !window.echarts) return;
    var ch = echarts.init(el);
    _charts.push(ch);
    ch.setOption(option);
  }

  // 总线索门店对比(单柱)
  function renderTotalLeadsByStore(id, storeStats) {
    renderChart(id, {
      grid: { left: 30, right: 20, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return v+' 条';} },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '条' },
      series: [{ type: 'bar', barMaxWidth: 48, data: storeStats.map(function(x){return x.t.leadsTotal;}),
        itemStyle: { color: '#2563eb', borderRadius: [6,6,0,0] } }]
    });
  }
  // 总线索门店排名(从高到低)
  function renderLeadsRank(id, storeStats) {
    var sorted = storeStats.slice().sort(function(a,b){ return b.t.leadsTotal - a.t.leadsTotal; });
    renderChart(id, {
      grid: { left: 30, right: 20, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return v+' 条';} },
      xAxis: { type: 'category', data: sorted.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '条' },
      series: [{ type: 'bar', barMaxWidth: 42, data: sorted.map(function(x){return x.t.leadsTotal;}),
        itemStyle: { color: '#2563eb', borderRadius: [6,6,0,0] } }]
    });
  }
  // 订单门店排名
  function renderOrdersRank(id, storeStats) {
    var sorted = storeStats.slice().sort(function(a,b){ return b.t.orders - a.t.orders; });
    renderChart(id, {
      grid: { left: 30, right: 20, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return v+' 台';} },
      xAxis: { type: 'category', data: sorted.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '台' },
      series: [{ type: 'bar', barMaxWidth: 42, data: sorted.map(function(x){return x.t.orders;}),
        itemStyle: { color: '#07c160', borderRadius: [6,6,0,0] } }]
    });
  }
  // 到店率门店排名
  function renderVisitRateRank(id, storeStats) {
    var sorted = storeStats.slice().sort(function(a,b){
      var va = a.t.leadsTotal ? a.t.visits / a.t.leadsTotal : 0;
      var vb = b.t.leadsTotal ? b.t.visits / b.t.leadsTotal : 0;
      return vb - va;
    });
    renderChart(id, {
      grid: { left: 30, right: 20, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return v+'%';} },
      xAxis: { type: 'category', data: sorted.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '到店率', axisLabel: { formatter: '{value}%' } },
      series: [{ type: 'bar', barMaxWidth: 42,
        data: sorted.map(function(x){return x.t.leadsTotal ? Math.round(x.t.visits / x.t.leadsTotal * 1000) / 10 : 0;}),
        itemStyle: { color: '#8b5cf6', borderRadius: [6,6,0,0] } }]
    });
  }
  // 线索转化率门店排名
  function renderConvRateRank(id, storeStats) {
    var sorted = storeStats.slice().sort(function(a,b){ return b.t.convRate - a.t.convRate; });
    renderChart(id, {
      grid: { left: 30, right: 20, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return v+'%';} },
      xAxis: { type: 'category', data: sorted.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '转化率', axisLabel: { formatter: '{value}%' } },
      series: [{ type: 'bar', barMaxWidth: 42,
        data: sorted.map(function(x){return Math.round(x.t.convRate * 1000) / 10;}),
        itemStyle: { color: '#f59e0b', borderRadius: [6,6,0,0] } }]
    });
  }

  // 单渠道门店对比(7个渠道各一张)
  function renderChannelByStore(id, storeStats, channelKey, channelName, color) {
    renderChart(id, {
      grid: { left: 30, right: 20, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return v+' 条';} },
      title: { text: channelName, left: 'center', top: 5, textStyle: { fontSize: 13, fontWeight: 600 } },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '条' },
      series: [{ type: 'bar', barMaxWidth: 48,
        data: storeStats.map(function(x){return x.t.leads[channelKey] || 0;}),
        itemStyle: { color: color, borderRadius: [6,6,0,0] } }]
    });
  }

  // 总消耗门店对比(单柱)
  function renderTotalCostByStore(id, storeStats) {
    renderChart(id, {
      grid: { left: 55, right: 20, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis', valueFormatter: function(v){return '¥'+v.toLocaleString();} },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '元' },
      series: [{ type: 'bar', barMaxWidth: 48, data: storeStats.map(function(x){return x.t.costTotal;}),
        itemStyle: { color: '#07c160', borderRadius: [6,6,0,0] } }]
    });
  }
  // 到店+成交门店对比
  function renderBizByStore(id, storeStats) {
    renderChart(id, {
      grid: { left: 30, right: 30, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['到店', '订单'], textStyle: {fontSize:11} },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '组/台' },
      series: [
        { name: '到店', type: 'bar', barMaxWidth: 28, data: storeStats.map(function(x){return x.t.visits;}), itemStyle: { color: '#2563eb', borderRadius: [4,4,0,0] } },
        { name: '订单', type: 'bar', barMaxWidth: 28, data: storeStats.map(function(x){return x.t.orders;}), itemStyle: { color: '#07c160', borderRadius: [4,4,0,0] } }
      ]
    });
  }
  // 效率对比(门店)
  function renderEffByStore(id, storeStats) {
    renderChart(id, {
      grid: { left: 55, right: 55, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['线索成本', '转化率'], textStyle: {fontSize:11} },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: [
        { type: 'value', name: '元', position: 'left' },
        { type: 'value', name: '转化率', position: 'right', axisLabel: { formatter: '{value}%' } }
      ],
      series: [
        { name: '线索成本', type: 'bar', barMaxWidth: 28, yAxisIndex: 0,
          data: storeStats.map(function(x){return x.t.cpl;}),
          itemStyle: { color: '#93b4f5', borderRadius: [4,4,0,0] } },
        { name: '转化率', type: 'line', smooth: true, yAxisIndex: 1,
          data: storeStats.map(function(x){return Math.round(x.t.convRate * 1000) / 10;}),
          itemStyle: { color: '#07c160' }, lineStyle: { width: 2.5 } }
      ]
    });
  }

  // 线索渠道堆叠(门店对比)
  function renderLeadsStack(id, storeStats) {
    var colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    var series = M.LEAD_CHANNELS.map(function (c, i) {
      return { name: c.name, type: 'bar', stack: 'total', barMaxWidth: 40, itemStyle: {color: colors[i]},
        data: storeStats.map(function(x){return x.t.leads[c.key]||0;}) };
    });
    renderChart(id, {
      grid: { left: 30, right: 20, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis', axisPointer: {type:'shadow'} },
      legend: { bottom: 0, type: 'scroll', textStyle: {fontSize: 11} },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '条' },
      series: series
    });
  }
  // 消耗堆叠(门店对比)
  function renderCostStack(id, storeStats) {
    var colors = ['#2563eb', '#93b4f5', '#1d4ed8', '#60a5fa'];
    var series = M.COST_TYPES.map(function (c, i) {
      return { name: c.name, type: 'bar', stack: 'total', barMaxWidth: 40, itemStyle: {color: colors[i]},
        data: storeStats.map(function(x){return x.t.cost[c.key]||0;}) };
    });
    renderChart(id, {
      grid: { left: 55, right: 20, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis', axisPointer: {type:'shadow'}, valueFormatter: function(v){return '¥'+v.toLocaleString();} },
      legend: { bottom: 0, type: 'scroll', textStyle: {fontSize: 11} },
      xAxis: { type: 'category', data: storeStats.map(function(x){return x.store.name;}), axisLabel: {fontSize:11} },
      yAxis: { type: 'value', name: '元' },
      series: series
    });
  }
  // 趋势图(n天)
  function renderTrendChart(id, series, days) {
    var el = document.getElementById(id);
    if (!el || !window.echarts) return;
    var ch = echarts.init(el);
    _charts.push(ch);
    var sn = series.slice(-days);
    ch.setOption({
      grid: { left: 40, right: 40, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis' },
      legend: { data: ['线索', '到店', '订单'], bottom: 0, textStyle: {fontSize: 11} },
      xAxis: { type: 'category', data: sn.map(function(x){return x.label;}), axisLabel: {fontSize:10} },
      yAxis: [
        { type: 'value', name: '线索' },
        { type: 'value', name: '到店/订单' }
      ],
      series: [
        { name: '线索', type: 'bar', barMaxWidth: 18, data: sn.map(function(x){return x.leadsTotal;}),
          itemStyle: { color: '#93b4f5', borderRadius: [3,3,0,0] },
          markPoint: {
            symbolSize: 38,
            label: { fontSize: 10, color: '#fff', fontWeight: 600 },
            data: [
              { type: 'max', name: '最高', itemStyle: { color: '#07c160' } },
              { type: 'min', name: '最低', itemStyle: { color: '#dc2626' } }
            ]
          }
        },
        { name: '到店', type: 'line', smooth: true, yAxisIndex: 1, data: sn.map(function(x){return x.visits;}), itemStyle: { color: '#2563eb' }, lineStyle: { width: 2 } },
        { name: '订单', type: 'line', smooth: true, yAxisIndex: 1, data: sn.map(function(x){return x.orders;}), itemStyle: { color: '#07c160' }, lineStyle: { width: 2 } }
      ]
    });
  }

  // 城市对比图(集团总览用)
  function cityComparisonChart(id, period) {
    // 按城市聚合
    var cityMap = {};
    M.STORES.forEach(function (s) {
      var c = s.city;
      if (!cityMap[c]) cityMap[c] = { name: c, leads: 0, orders: 0, cost: 0, stores: 0 };
      var t = M.storeAgg(s.id, period);
      cityMap[c].leads += t.leadsTotal;
      cityMap[c].orders += t.orders;
      cityMap[c].cost += t.costTotal;
      cityMap[c].stores++;
    });
    var cities = Object.values(cityMap).sort(function(a,b){ return b.leads - a.leads; });
    renderChart(id, {
      grid: { left: 40, right: 50, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['线索', '订单', '消耗'], textStyle: {fontSize: 11} },
      xAxis: { type: 'category', data: cities.map(function(x){return x.name;}), axisLabel: {fontSize: 11} },
      yAxis: [
        { type: 'value', name: '线索/订单' },
        { type: 'value', name: '万元', axisLabel: { formatter: function(v){ return (v/10000).toFixed(0); } } }
      ],
      series: [
        { name: '线索', type: 'bar', barMaxWidth: 26, data: cities.map(function(x){return x.leads;}), itemStyle: { color: '#2563eb', borderRadius: [4,4,0,0] } },
        { name: '订单', type: 'bar', barMaxWidth: 26, data: cities.map(function(x){return x.orders;}), itemStyle: { color: '#07c160', borderRadius: [4,4,0,0] } },
        { name: '消耗', type: 'line', yAxisIndex: 1, smooth: true, data: cities.map(function(x){return x.cost;}), itemStyle: { color: '#f59e0b' }, lineStyle: { width: 2.5 } }
      ]
    });
  }

  // 网系对比图(集团总览用)
  function brandComparisonChart(id) {
    var brands = M.BRANDS;
    var leadsData = brands.map(function(b){ return M.brandAgg(b.id, 'today').leadsTotal; });
    var ordersData = brands.map(function(b){ return M.brandAgg(b.id, 'today').orders; });
    var costData = brands.map(function(b){ return M.brandAgg(b.id, 'today').costTotal; });
    renderChart(id, {
      grid: { left: 40, right: 50, top: 30, bottom: 40 },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, data: ['线索', '订单', '消耗'], textStyle: {fontSize: 11} },
      xAxis: { type: 'category', data: brands.map(function(b){return b.name;}), axisLabel: {fontSize: 11} },
      yAxis: [
        { type: 'value', name: '线索/订单' },
        { type: 'value', name: '万元', axisLabel: { formatter: function(v){ return (v/10000).toFixed(0); } } }
      ],
      series: [
        { name: '线索', type: 'bar', barMaxWidth: 28, data: leadsData, itemStyle: { color: '#2563eb', borderRadius: [4,4,0,0] } },
        { name: '订单', type: 'bar', barMaxWidth: 28, data: ordersData, itemStyle: { color: '#07c160', borderRadius: [4,4,0,0] } },
        { name: '消耗', type: 'line', yAxisIndex: 1, smooth: true, data: costData, itemStyle: { color: '#f59e0b' }, lineStyle: { width: 2.5 } }
      ]
    });
  }

  function metricBlock(t, title) {
    return '<div class="section-title">' + title + '</div><div class="metric-grid">' +
      '<div class="metric"><div class="m-label">线索成本</div><div class="m-val">' + money(t.cpl) + '</div><div class="m-sub">每条线索</div></div>' +
      '<div class="metric"><div class="m-label">订单成本</div><div class="m-val">' + money(t.orderCost) + '</div><div class="m-sub">每个订单</div></div>' +
      '<div class="metric"><div class="m-label">交车成本</div><div class="m-val">' + money(t.deliveryCost) + '</div><div class="m-sub">每台交车(IT)</div></div>' +
      '<div class="metric"><div class="m-label">线索转化率</div><div class="m-val">' + pct(t.convRate) + '</div><div class="m-sub">线索→订单</div></div>' +
      '</div>';
  }

  function anchorRankBlock(list, title, showCost) {
    var html = '<div class="section-title">' + title + '</div><div class="card"><table class="rank-table">' +
      '<thead><tr><th>#</th><th>主播</th><th>线索</th><th>到店</th><th>订单</th>' + (showCost ? '<th>总消耗</th>' : '') + '</tr></thead><tbody>';
    list.forEach(function (x, i) {
      html += '<tr onclick="go(\'/anchor/' + x.anchor.id + '\')">' +
        '<td><span class="rank-num' + (i < 3 ? ' top' : '') + '">' + (i + 1) + '</span></td>' +
        '<td class="link">' + esc(x.anchor.name) + '<span class="store-tag">' + esc(x.store.name) + '</span></td>' +
        '<td><b>' + x.t.leadsTotal + '</b></td>' +
        '<td>' + x.t.visits + '</td>' +
        '<td>' + x.t.orders + '</td>' +
        (showCost ? '<td>' + money(x.t.costTotal) + '</td>' : '') +
        '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  // 门店导航卡片
  function storeNavCards(stores, brandId) {
    var html = '<div class="section-title">门店导航</div><div class="store-nav">';
    stores.forEach(function (s) {
      var t = M.storeAgg(s.id, 'today');
      html += '<div class="store-nav-card" onclick="go(\'/store/' + s.id + '\')">' +
        '<div class="snc-name">' + esc(s.name) + '</div>' +
        '<div class="snc-metrics">' +
        '<div><span>线索</span><b>' + t.leadsTotal + '</b></div>' +
        '<div><span>到店</span><b>' + t.visits + '</b></div>' +
        '<div><span>订单</span><b>' + t.orders + '</b></div>' +
        '</div></div>';
    });
    html += '</div>';
    return html;
  }

  // 网系分析卡片(集团总览用)
  function brandAnalysisCard(brandId, period) {
    var b = M.brandById(brandId);
    var t = M.brandAgg(brandId, period);
    var stores = M.storesOfBrand(brandId);
    var ranks = M.storeRanking(brandId, period);
    var top3 = ranks.slice(0, 3);
    var visitRate = t.leadsTotal ? t.visits / t.leadsTotal : 0;

    var html = '<div class="brand-card" onclick="go(\'/brand/' + brandId + '\')">' +
      '<div class="bc-header">' +
      '<span class="bc-name">' + b.name + '</span>' +
      '<span class="bc-count">' + stores.length + '家门店</span>' +
      '</div>' +
      '<div class="bc-metrics">' +
      '<div><span>订单</span><b>' + t.orders + '</b><small>台</small></div>' +
      '<div><span>线索</span><b>' + t.leadsTotal + '</b><small>条</small></div>' +
      '<div><span>转化率</span><b>' + pct(t.convRate) + '</b></div>' +
      '</div>' +
      '<div class="bc-top-title">门店 TOP3</div>' +
      '<div class="bc-top-list">';
    top3.forEach(function (x, i) {
      html += '<div class="bc-top-item">' +
        '<span class="bc-rank">' + (i+1) + '</span>' +
        '<span class="bc-top-name">' + esc(x.store.name) + '</span>' +
        '<span class="bc-top-val">' + x.t.orders + '台</span>' +
        '</div>';
    });
    html += '</div></div>';
    return html;
  }

  // 按城市分组的门店导航(集团总览用)
  function buildCityNavCards() {
    var cities = {};
    M.STORES.forEach(function (s) {
      if (!cities[s.city]) cities[s.city] = [];
      cities[s.city].push(s);
    });
    // 按门店数排序
    var cityList = Object.keys(cities).sort(function(a,b){ return cities[b].length - cities[a].length; });
    var html = '<div class="section-title">各城市门店</div>';
    cityList.forEach(function (city) {
      var stores = cities[city];
      // 计算城市合计
      var leads = 0, orders = 0;
      stores.forEach(function (s) {
        var t = M.storeAgg(s.id, 'today');
        leads += t.leadsTotal; orders += t.orders;
      });
      html += '<div class="city-block">' +
        '<div class="city-header"><span class="city-name">' + city + '</span>' +
        '<span class="city-sub">' + stores.length + '家门店 · ' + leads + '条线索 · ' + orders + '台订单</span></div>' +
        '<div class="store-nav">';
      stores.forEach(function (s) {
        var t = M.storeAgg(s.id, 'today');
        html += '<div class="store-nav-card small" onclick="go(\'/store/' + s.id + '\')">' +
          '<div class="snc-name">' + esc(s.name) + '</div>' +
          '<div class="snc-metrics">' +
          '<div><span>线索</span><b>' + t.leadsTotal + '</b></div>' +
          '<div><span>订单</span><b>' + t.orders + '</b></div>' +
          '</div></div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  // 渠道/消耗细分(单店/主播页用)
  function channelBlock(leads, leadsTotal, title) {
    var colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    var rows = M.LEAD_CHANNELS.map(function (c, i) {
      var v = leads[c.key] || 0;
      var p = leadsTotal ? v / leadsTotal : 0;
      return { name: c.name, value: v, pct: p, color: colors[i], hasCost: c.hasCost };
    });
    var html = '<div class="section-title">' + title + '</div><div class="card"><div class="ch-list">';
    rows.forEach(function (r) {
      html += '<div class="ch-row">' +
        '<div class="ch-name"><i style="background:' + r.color + '"></i>' + r.name + (r.hasCost ? '' : '<span class="tag-mini">无消耗</span>') + '</div>' +
        '<div class="ch-bar-wrap"><div class="ch-bar"><i style="width:' + Math.round(r.pct * 100) + '%;background:' + r.color + '"></i></div></div>' +
        '<div class="ch-num">' + r.value + '<small>' + pct(r.pct) + '</small></div>' +
        '</div>';
    });
    html += '</div></div>';
    return html;
  }
  function costBlock(cost, costTotal, title) {
    var html = '<div class="section-title">' + title + '</div><div class="card"><div class="ch-list">';
    M.COST_TYPES.forEach(function (c) {
      var v = cost[c.key] || 0;
      var p = costTotal ? v / costTotal : 0;
      html += '<div class="ch-row">' +
        '<div class="ch-name">' + c.name + '</div>' +
        '<div class="ch-bar-wrap"><div class="ch-bar"><i style="width:' + Math.round(p * 100) + '%;background:#2563eb"></i></div></div>' +
        '<div class="ch-num">' + money(v) + '<small>' + pct(p) + '</small></div>' +
        '</div>';
    });
    html += '<div class="ch-row total">' +
      '<div class="ch-name"><b>合计</b></div><div class="ch-bar-wrap"></div>' +
      '<div class="ch-num"><b>' + money(costTotal) + '</b></div></div>';
    html += '</div></div>';
    return html;
  }

  function footnote() {
    return '<div class="footnote">新港集团新媒体数据中心 · Demo版<br>当前为演示数据 · 框架定稿后接 IT 真实数据</div>';
  }

  /* ============== 公共: 总览页/网系页的"三观"生成 ============== */
  // 生成总览视图(简化版): AI概览 + KPI + 指标分析 + 3张对比 + 主播排名 + 门店导航
  function buildOverviewView(ov, scopeName, anchorRanks, storeList, showStoreNav, showAnchorRanks) {
    var t = ov.total;
    var html = '';
    html += aiOverview(ov);

    // ===== 核心指标区 =====
    html += '<div class="kpi-tag">昨日数据 · ' + scopeName + '</div>';

    // 1. 订单 + 总线索（左右并排）
    html += '<div class="hero-grid">' +
      '<div class="hero-order">' +
      '<div class="hero-label">订单</div>' +
      '<div class="hero-val">' + t.orders + '<small>台</small></div>' +
      '</div>' +
      '<div class="hero-order">' +
      '<div class="hero-label">总线索</div>' +
      '<div class="hero-val">' + num(t.leadsTotal) + '<small>条</small></div>' +
      '</div>' +
      '</div>';

    // 3. 分渠道（条形图）
    var colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    html += '<div class="card"><div class="ch-list">';
    M.LEAD_CHANNELS.forEach(function (c, i) {
      var v = t.leads[c.key] || 0;
      var p = t.leadsTotal ? v / t.leadsTotal : 0;
      html += '<div class="ch-row">' +
        '<div class="ch-name"><i style="background:' + colors[i] + '"></i>' + c.name + (c.hasCost ? '' : '<span class="tag-mini">无消耗</span>') + '</div>' +
        '<div class="ch-bar-wrap"><div class="ch-bar"><i style="width:' + Math.round(p * 100) + '%;background:' + colors[i] + '"></i></div></div>' +
        '<div class="ch-num">' + v + '<small>' + pct(p) + '</small></div>' +
        '</div>';
    });
    html += '</div></div>';

    // 4. 消耗（自费/厂家）
    var zifei = t.cost.zhiboZifei + t.cost.duanyinzhi + t.cost.duanshipin;
    var changjia = t.cost.zhiboJili;
    html += '<div class="card cost-hero">' +
      '<div class="ch-label">总消耗</div>' +
      '<div class="ch-total">' + money(t.costTotal) + '</div>' +
      '<div class="cost-split">' +
      '<div><span>自费</span><b>' + money(zifei) + '</b></div>' +
      '<div><span>厂家</span><b>' + money(changjia) + '</b></div>' +
      '</div></div>';

    // 5. 转化（到店率+线索转化率）
    var visitRate = t.leadsTotal ? t.visits / t.leadsTotal : 0;
    html += '<div class="card conv-hero">' +
      '<div>' +
      '  <div class="conv-label">线索到店率</div>' +
      '  <div class="conv-val">' + pct(visitRate) + '</div>' +
      '</div>' +
      '<div>' +
      '  <div class="conv-label">线索转化率</div>' +
      '  <div class="conv-val">' + pct(t.convRate) + '</div>' +
      '</div></div>';

    // 门店排名图
    html += chartPlaceholder('c1', '总线索门店排名');
    html += chartPlaceholder('c2', '订单门店排名');
    html += chartPlaceholder('c3', '到店率门店排名');
    html += chartPlaceholder('c4', '线索转化率门店排名');
    if (showAnchorRanks !== false) html += anchorRankBlock(anchorRanks, '主播排名(按线索)', true);
    if (showStoreNav !== false) html += storeNavCards(storeList);
    html += footnote();
    return {
      html: html,
      charts: [
        { type: 'leadsRank', id: 'c1', data: ov.storeStats },
        { type: 'ordersRank', id: 'c2', data: ov.storeStats },
        { type: 'visitRateRank', id: 'c3', data: ov.storeStats },
        { type: 'convRateRank', id: 'c4', data: ov.storeStats }
      ]
    };
  }
  // 生成详细视图(周/月): KPI + 趋势 + 渠道 + 门店排名 + 主播排名
  function buildDetailView(period, aggFn, seriesFn, rankFn, scopeName) {
    var t = aggFn();
    var storeStats = M.storeRanking(period === 'week' ? null : null, period); // 板块级
    var pInfo = M.periodInfo(period);
    var days = pInfo.days;
    var html = '';
    html += '<div class="kpi-tag">' + pInfo.label + '累计 · ' + scopeName + '</div>';

    // ===== 核心指标 =====
    // 1. 订单 + 总线索（左右并排）
    html += '<div class="hero-grid">' +
      '<div class="hero-order">' +
      '<div class="hero-label">订单</div>' +
      '<div class="hero-val">' + num(t.orders) + '<small>台</small></div>' +
      '</div>' +
      '<div class="hero-order">' +
      '<div class="hero-label">总线索</div>' +
      '<div class="hero-val">' + num(t.leadsTotal) + '<small>条</small></div>' +
      '</div>' +
      '</div>';

    // 2. 分渠道（条形图）
    var colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    html += '<div class="section-title">渠道贡献</div>';
    html += '<div class="card"><div class="ch-list">';
    M.LEAD_CHANNELS.forEach(function (c, i) {
      var v = t.leads[c.key] || 0;
      var p = t.leadsTotal ? v / t.leadsTotal : 0;
      html += '<div class="ch-row">' +
        '<div class="ch-name"><i style="background:' + colors[i] + '"></i>' + c.name + (c.hasCost ? '' : '<span class="tag-mini">无消耗</span>') + '</div>' +
        '<div class="ch-bar-wrap"><div class="ch-bar"><i style="width:' + Math.round(p * 100) + '%;background:' + colors[i] + '"></i></div></div>' +
        '<div class="ch-num">' + num(v) + '<small>' + pct(p) + '</small></div>' +
        '</div>';
    });
    html += '</div></div>';

    // 3. 消耗（自费/厂家）
    var zifei = t.cost.zhiboZifei + t.cost.duanyinzhi + t.cost.duanshipin;
    var changjia = t.cost.zhiboJili;
    html += '<div class="card cost-hero">' +
      '<div class="ch-label">总消耗</div>' +
      '<div class="ch-total">' + money(t.costTotal) + '</div>' +
      '<div class="cost-split">' +
      '<div><span>自费</span><b>' + money(zifei) + '</b></div>' +
      '<div><span>厂家</span><b>' + money(changjia) + '</b></div>' +
      '</div></div>';

    // 4. 转化
    var visitRate = t.leadsTotal ? t.visits / t.leadsTotal : 0;
    html += '<div class="card conv-hero">' +
      '<div>' +
      '  <div class="conv-label">线索到店率</div>' +
      '  <div class="conv-val">' + pct(visitRate) + '</div>' +
      '</div>' +
      '<div>' +
      '  <div class="conv-label">线索转化率</div>' +
      '  <div class="conv-val">' + pct(t.convRate) + '</div>' +
      '</div></div>';

    // ===== 趋势对比 =====
    html += chartPlaceholder('c1', pInfo.label + '每日趋势');

    // ===== 门店排名对比 =====
    html += chartPlaceholder('c2', '门店订单排名');
    html += chartPlaceholder('c3', '门店线索排名');

    // ===== 主播排名 =====
    var ranks = rankFn();
    html += anchorRankBlock(ranks, '主播排名(按线索)', true);

    html += footnote();
    return { html: html, t: t, storeStats: storeStats, series: seriesFn(), ranks: ranks };
  }

  /* ================= 页面: 板块总览 ================= */
  function overviewView(query) {
    var view = query.view || 'overview';
    var html = topbar() + navbar(null) + '<div class="page">';
    html += viewSwitch(view, '');
    var out;

    if (view === 'overview') {
      var t = M.groupAgg('today');
      var charts = [];

      html += '<div class="kpi-tag">昨日数据 · 全集团</div>';

      // 核心指标: 订单 + 线索
      html += '<div class="hero-grid">' +
        '<div class="hero-order">' +
        '<div class="hero-label">订单</div>' +
        '<div class="hero-val">' + num(t.orders) + '<small>台</small></div>' +
        '</div>' +
        '<div class="hero-order">' +
        '<div class="hero-label">总线索</div>' +
        '<div class="hero-val">' + num(t.leadsTotal) + '<small>条</small></div>' +
        '</div>' +
        '</div>';

      // 城市对比 + 网系对比
      html += '<div class="section-title">城市对比</div><div class="card"><div id="city-comp" style="height:260px"></div></div>';
      html += '<div class="section-title">网系对比</div><div class="card"><div id="brand-comp" style="height:260px"></div></div>';
      charts.push({ type: 'cityCompare', id: 'city-comp' });
      charts.push({ type: 'brandCompare', id: 'brand-comp' });

      // 网系分析(4个卡片)
      html += '<div class="section-title">网系分析</div>';
      M.BRANDS.forEach(function (b) {
        html += brandAnalysisCard(b.id, 'today');
      });

      // 各城市门店导航
      html += buildCityNavCards();
      html += footnote();
      html += '</div>';
      return { html: html, charts: charts };
    }

    // week / month 详细视图
    var period = view;
    var t = M.groupAgg(period);
    var pInfo = M.periodInfo(period);
    var days = pInfo.days;
    var storeStats = M.storeRanking(null, period);
    var ov = M.buildOverview(null, period);
    ov.view = period;

    html += aiOverview(ov);
    html += '<div class="kpi-tag">' + pInfo.label + '累计 · 全集团</div>';

    // 核心指标: 订单 + 线索
    html += '<div class="hero-grid">' +
      '<div class="hero-order">' +
      '<div class="hero-label">订单</div>' +
      '<div class="hero-val">' + num(t.orders) + '<small>台</small></div>' +
      '</div>' +
      '<div class="hero-order">' +
      '<div class="hero-label">总线索</div>' +
      '<div class="hero-val">' + num(t.leadsTotal) + '<small>条</small></div>' +
      '</div>' +
      '</div>';

    // 分渠道
    var _colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    html += '<div class="card"><div class="ch-list">';
    M.LEAD_CHANNELS.forEach(function (c, i) {
      var v = t.leads[c.key] || 0;
      var p = t.leadsTotal ? v / t.leadsTotal : 0;
      html += '<div class="ch-row">' +
        '<div class="ch-name"><i style="background:' + _colors[i] + '"></i>' + c.name + (c.hasCost ? '' : '<span class="tag-mini">无消耗</span>') + '</div>' +
        '<div class="ch-bar-wrap"><div class="ch-bar"><i style="width:' + Math.round(p * 100) + '%;background:' + _colors[i] + '"></i></div></div>' +
        '<div class="ch-num">' + num(v) + '<small>' + pct(p) + '</small></div>' +
        '</div>';
    });
    html += '</div></div>';

    // 消耗
    var _zifei = t.cost.zhiboZifei + t.cost.duanyinzhi + t.cost.duanshipin;
    var _changjia = t.cost.zhiboJili;
    html += '<div class="card cost-hero">' +
      '<div class="ch-label">总消耗</div>' +
      '<div class="ch-total">' + money(t.costTotal) + '</div>' +
      '<div class="cost-split">' +
      '<div><span>自费</span><b>' + money(_zifei) + '</b></div>' +
      '<div><span>厂家</span><b>' + money(_changjia) + '</b></div>' +
      '</div></div>';

    // 转化
    var _vr = t.leadsTotal ? t.visits / t.leadsTotal : 0;
    html += '<div class="card conv-hero">' +
      '<div><div class="conv-label">线索到店率</div><div class="conv-val">' + pct(_vr) + '</div></div>' +
      '<div><div class="conv-label">线索转化率</div><div class="conv-val">' + pct(t.convRate) + '</div></div>' +
      '</div>';

    // 趋势 + 网系对比 + 网系分析
    html += chartPlaceholder('c1', pInfo.label + '每日趋势');
    var brandChartHtml = '<div class="section-title">网系对比</div><div class="card"><div id="brand-comp2" style="height:260px"></div></div>';
    var brandCardsHtml = '<div class="section-title">网系分析</div>';
    M.BRANDS.forEach(function (b) {
      brandCardsHtml += brandAnalysisCard(b.id, period);
    });
    html += brandChartHtml + brandCardsHtml;
    html += footnote() + '</div>';

    return {
      html: html,
      charts: [
        { type: 'trend', id: 'c1', data: { series: M.groupSeries(), days: days } },
        { type: 'brandCompare', id: 'brand-comp2' }
      ]
    };
  }

  /* ================= 页面: 网系 ================= */
  function brandView(brandId, query) {
    var b = M.brandById(brandId);
    if (!b) return { html: topbar() + '<div class="page"><div class="empty">网系不存在</div></div>' };
    var view = query.view || 'overview';
    var brandStores = M.storesOfBrand(brandId);
    var html = topbar() + navbar(brandId) + '<div class="page">';
    html += brandInnerNav(brandId, view);

    if (view === 'overview') {
      var ov = M.buildOverview(brandId, 'today');
      ov.view = 'overview';
      var ranks = M.anchorRanking({ brandId: brandId }, 'today');
      var out = buildOverviewView(ov, b.name, ranks, brandStores, false, true);
      html += out.html;
      html += '</div>';
      return { html: html, charts: out.charts };
    }

    // week / month 详细视图
    var period = view;
    var t = M.brandAgg(brandId, period);
    var pInfo = M.periodInfo(period);
    var days = pInfo.days;
    var storeStats = M.storeRanking(brandId, period);
    var ov = M.buildOverview(brandId, period);
    ov.view = period;

    html += aiOverview(ov);
    html += '<div class="kpi-tag">' + pInfo.label + '累计 · ' + b.name + '</div>';

    // 核心指标: 订单 + 线索
    html += '<div class="hero-grid">' +
      '<div class="hero-order">' +
      '<div class="hero-label">订单</div>' +
      '<div class="hero-val">' + num(t.orders) + '<small>台</small></div>' +
      '</div>' +
      '<div class="hero-order">' +
      '<div class="hero-label">总线索</div>' +
      '<div class="hero-val">' + num(t.leadsTotal) + '<small>条</small></div>' +
      '</div>' +
      '</div>';

    // 分渠道
    var __colors = ['#fe2c55', '#ff7a00', '#ffc107', '#07c160', '#ff2e4d', '#93a1b8', '#8b5cf6'];
    html += '<div class="card"><div class="ch-list">';
    M.LEAD_CHANNELS.forEach(function (c, i) {
      var v = t.leads[c.key] || 0;
      var p = t.leadsTotal ? v / t.leadsTotal : 0;
      html += '<div class="ch-row">' +
        '<div class="ch-name"><i style="background:' + __colors[i] + '"></i>' + c.name + (c.hasCost ? '' : '<span class="tag-mini">无消耗</span>') + '</div>' +
        '<div class="ch-bar-wrap"><div class="ch-bar"><i style="width:' + Math.round(p * 100) + '%;background:' + __colors[i] + '"></i></div></div>' +
        '<div class="ch-num">' + num(v) + '<small>' + pct(p) + '</small></div>' +
        '</div>';
    });
    html += '</div></div>';

    // 消耗
    var __zifei = t.cost.zhiboZifei + t.cost.duanyinzhi + t.cost.duanshipin;
    var __changjia = t.cost.zhiboJili;
    html += '<div class="card cost-hero">' +
      '<div class="ch-label">总消耗</div>' +
      '<div class="ch-total">' + money(t.costTotal) + '</div>' +
      '<div class="cost-split">' +
      '<div><span>自费</span><b>' + money(__zifei) + '</b></div>' +
      '<div><span>厂家</span><b>' + money(__changjia) + '</b></div>' +
      '</div></div>';

    // 转化
    var __vr = t.leadsTotal ? t.visits / t.leadsTotal : 0;
    html += '<div class="card conv-hero">' +
      '<div><div class="conv-label">线索到店率</div><div class="conv-val">' + pct(__vr) + '</div></div>' +
      '<div><div class="conv-label">线索转化率</div><div class="conv-val">' + pct(t.convRate) + '</div></div>' +
      '</div>';

    // 趋势 + 门店排名
    html += chartPlaceholder('c1', pInfo.label + '每日趋势');
    html += chartPlaceholder('c2', '门店订单排名');
    html += chartPlaceholder('c3', '门店线索排名');
    var ranks = M.anchorRanking({ brandId: brandId }, period);
    html += anchorRankBlock(ranks, '主播排名(按线索)', true);
    html += footnote() + '</div>';

    return {
      html: html,
      charts: [
        { type: 'trend', id: 'c1', data: { series: M.brandSeries(brandId), days: days } },
        { type: 'ordersRank', id: 'c2', data: storeStats },
        { type: 'leadsRank', id: 'c3', data: storeStats }
      ]
    };
  }

  /* ================= 页面: 门店 ================= */
  function storeView(storeId, query) {
    var s = M.storeById[storeId];
    if (!s) return { html: topbar() + '<div class="page"><div class="empty">门店不存在</div></div>' };
    var b = M.brandById(s.brand);
    var period = query.period || 'today';
    var t = M.storeAgg(storeId, period);
    var anchorRanks = M.anchorRanking({ storeId: storeId }, period);

    var html = topbar() + '<div class="page">';
    html += '<div class="crumb"><span class="back-link" onclick="go(\'/brand/' + s.brand + '\')">‹ ' + b.name + '</span>' +
      '<div class="crumb-title">' + esc(s.name) + '<span class="sub">' + b.name + ' · 主管 ' + esc(s.mgr) + '</span></div></div>';
    html += periodSwitch(period, '/store/' + storeId);

    html += kpiStrip([
      { label: '有效线索', value: num(t.leadsTotal), unit: '条' },
      { label: '到店', value: num(t.visits), unit: '组' },
      { label: '订单', value: num(t.orders), unit: '台' },
      { label: '总消耗', value: money(t.costTotal) }
    ]);
    html += '<div class="kpi-tag">' + (period==='today'?'昨日':period==='week'?'本周':'本月') + '数据</div>';

    html += metricBlock(t, '指标分析');
    html += channelBlock(t.leads, t.leadsTotal, '线索渠道细分');
    html += costBlock(t.cost, t.costTotal, '消耗细分');
    html += anchorRankBlock(anchorRanks, '主播排名(按线索)', false);

    if (period !== 'today') {
      var pInfo = M.periodInfo(period);
    var days = pInfo.days;
      html += chartPlaceholder('ch-st', pInfo.label + '趋势');
    }
    html += footnote() + '</div>';

    return {
      html: html,
      charts: period !== 'today' ? [
        { type: 'trend', id: 'ch-st', data: { series: M.storeSeries(storeId), days: days } }
      ] : []
    };
  }

  /* ================= 页面: 主播 ================= */
  function anchorView(anchorId, query) {
    var a = M.anchorById(anchorId);
    if (!a) return { html: topbar() + '<div class="page"><div class="empty">主播不存在</div></div>' };
    var s = M.storeById[a.store];
    var period = query.period || 'today';
    var t = M.anchorAgg(anchorId, period);

    var html = topbar() + '<div class="page">';
    html += '<div class="crumb"><span class="back-link" onclick="go(\'/store/' + a.store + '\')">‹ ' + esc(s.name) + '</span>' +
      '<div class="crumb-title">' + esc(a.name) + '<span class="sub">' + esc(s.name) + '</span></div></div>';
    html += periodSwitch(period, '/anchor/' + anchorId);

    html += kpiStrip([
      { label: '有效线索', value: num(t.leadsTotal), unit: '条' },
      { label: '到店', value: num(t.visits), unit: '组' },
      { label: '订单', value: num(t.orders), unit: '台' },
      { label: '总消耗', value: money(t.costTotal) },
      { label: '直播时长', value: hoursFmt(t.hours) }
    ]);
    html += '<div class="kpi-tag">' + (period==='today'?'昨日':period==='week'?'本周':'本月') + '数据</div>';

    html += metricBlock(t, '指标分析');
    html += channelBlock(t.leads, t.leadsTotal, '线索渠道细分');
    html += costBlock(t.cost, t.costTotal, '消耗细分');
    if (period !== 'today') {
      var pInfo = M.periodInfo(period);
    var days = pInfo.days;
      html += chartPlaceholder('ch-an', pInfo.label + '趋势');
    }
    html += footnote() + '</div>';

    return {
      html: html,
      charts: period !== 'today' ? [
        { type: 'trend', id: 'ch-an', data: { series: M.anchorSeries(anchorId), days: days } }
      ] : []
    };
  }

  /* ---------------- 渲染 ---------------- */
  function render() {
    var r = parseHash();
    var parts = r.path.split('/').filter(Boolean);
    var out;

    _charts.forEach(function (c) { try { c.dispose(); } catch (e) {} });
    _charts = [];

    if (parts.length === 0) {
      out = overviewView(r.query);
    } else if (parts[0] === 'brand' && parts[1]) {
      out = brandView(parts[1], r.query);
    } else if (parts[0] === 'store' && parts[1]) {
      out = storeView(parts[1], r.query);
    } else if (parts[0] === 'anchor' && parts[1]) {
      out = anchorView(parts[1], r.query);
    } else {
      out = overviewView(r.query);
    }

    document.getElementById('app').innerHTML = out.html;
    (out.charts || []).forEach(function (c) {
      if (c.type === 'leadsRank') renderLeadsRank(c.id, c.data);
      else if (c.type === 'ordersRank') renderOrdersRank(c.id, c.data);
      else if (c.type === 'visitRateRank') renderVisitRateRank(c.id, c.data);
      else if (c.type === 'convRateRank') renderConvRateRank(c.id, c.data);
      else if (c.type === 'totalLeads') renderTotalLeadsByStore(c.id, c.data);
      else if (c.type === 'totalCost') renderTotalCostByStore(c.id, c.data);
      else if (c.type === 'biz') renderBizByStore(c.id, c.data);
      else if (c.type === 'eff') renderEffByStore(c.id, c.data);
      else if (c.type === 'singleChannel') renderChannelByStore(c.id, c.data.storeStats, c.data.key, c.data.name, c.data.color);
      else if (c.type === 'brandCompare') brandComparisonChart(c.id);
      else if (c.type === 'cityCompare') cityComparisonChart(c.id, 'today');
      else if (c.type === 'leadsStack') renderLeadsStack(c.id, c.data);
      else if (c.type === 'costStack') renderCostStack(c.id, c.data);
      else if (c.type === 'trend') renderTrendChart(c.id, c.data.series, c.data.days);
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('resize', function () { _charts.forEach(function (c) { c.resize(); }); });
  render();
})();
