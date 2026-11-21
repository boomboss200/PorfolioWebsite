(function () {
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");

  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  document.querySelectorAll(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero: code being typed on a keyboard */
  var codeEl = document.getElementById("code");
  var kbEl = document.getElementById("keyboard");
  if (codeEl && kbEl) {
    var keys = {};
    ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].forEach(function (r) {
      var row = document.createElement("div");
      row.className = "kb-row";
      r.split("").forEach(function (c) {
        var k = document.createElement("span");
        k.className = "key"; k.textContent = c; keys[c] = k; row.appendChild(k);
      });
      kbEl.appendChild(row);
    });
    var sp = document.createElement("div");
    sp.className = "kb-row";
    var space = document.createElement("span");
    space.className = "key space"; keys[" "] = space; sp.appendChild(space);
    kbEl.appendChild(sp);

    // [class, text] tokens; "" = plain
    var T = [
      ["d", "@Controller"], ["", "("], ["s", "'reviews'"], ["", ")\n"],
      ["k", "export class "], ["f", "ReviewsController"], ["", " {\n"],
      ["", "  "], ["k", "constructor"], ["", "(private reviews: "], ["f", "ReviewsService"], ["", ") {}\n\n"],
      ["", "  "], ["d", "@Post"], ["", "()\n"],
      ["", "  "], ["k", "async "], ["f", "create"], ["", "(@Body() dto: "], ["f", "CreateReviewDto"], ["", ") {\n"],
      ["", "    "], ["c", "// queue notification via EventBridge\n"],
      ["", "    "], ["k", "return "], ["k", "this"], ["", ".reviews."], ["f", "create"], ["", "(dto);\n"],
      ["", "  }\n}"]
    ];
    var total = T.reduce(function (n, t) { return n + t[1].length; }, 0);
    var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    var render = function (n) {
      var out = "", left = n;
      for (var i = 0; i < T.length && left > 0; i++) {
        var part = T[i][1].slice(0, left);
        left -= part.length;
        out += T[i][0] ? '<span class="' + T[i][0] + '">' + esc(part) + "</span>" : esc(part);
      }
      codeEl.innerHTML = out;
    };
    var flat = T.map(function (t) { return t[1]; }).join("");
    if (reduced) { render(total); }
    else {
      var n = 0;
      var tick = function () {
        n++;
        render(n);
        var ch = flat[n - 1].toUpperCase();
        var k = keys[ch];
        if (k) { k.classList.add("hit"); setTimeout(function () { k.classList.remove("hit"); }, 110); }
        if (n >= total) { setTimeout(function () { n = 0; tick(); }, 3500); return; }
        setTimeout(tick, flat[n - 1] === "\n" ? 260 : 38 + Math.random() * 60);
      };
      setTimeout(tick, 600);
    }
  }

  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduced) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  items.forEach(function (el) { io.observe(el); });
})();
