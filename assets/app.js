const cloudWrap = document.getElementById("cloudWrap");
const cloudEmojis = ["☁️", "⛅", "🌤️", "☁️", "☁️", "⛅"];

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (document.body.querySelector(".section-hero") && !window.location.hash) {
  window.addEventListener("pageshow", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function spawnCloud() {
  if (!cloudWrap) return;

  const el = document.createElement("div");
  const size = 16 + Math.random() * 22;
  const top = 5 + Math.random() * 80;
  const duration = 22 + Math.random() * 18;
  const delay = Math.random() * -duration;

  el.className = "cloud-p";
  el.textContent = cloudEmojis[Math.floor(Math.random() * cloudEmojis.length)];
  el.style.cssText = `
    top: ${top}%;
    font-size: ${size}px;
    opacity: ${0.06 + Math.random() * 0.12};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    filter: blur(${Math.random() < 0.4 ? 1 : 0}px);
  `;

  cloudWrap.appendChild(el);
  el.addEventListener("animationiteration", () => {
    el.style.top = `${5 + Math.random() * 80}%`;
  });
}

for (let i = 0; i < 14; i += 1) {
  spawnCloud();
}

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const gridCards = [...document.querySelectorAll(".cards-grid .reveal")];
        const delay = entry.target.closest(".cards-grid") ? gridCards.indexOf(entry.target) * 55 : 0;
        setTimeout(() => entry.target.classList.add("visible"), Math.max(delay, 0));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

document.querySelectorAll(".module-card").forEach((card) => {
  card.addEventListener("click", function addRipple(event) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.className = "ripple-el";
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${event.clientX - rect.left - size / 2}px;
      top: ${event.clientY - rect.top - size / 2}px;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

const interactiveLists = document.querySelectorAll(".objectives-list, .compare-list, .model-grid");

interactiveLists.forEach((objList) => {
  const items = [...objList.querySelectorAll(".obj-item")];
  if (!items.length) return;

  items.forEach((item, index) => {
    item.addEventListener("click", function toggleObjective() {
      const isActive = this.classList.contains("active");

      items.forEach((current) => {
        current.classList.remove("active");
        current.setAttribute("aria-expanded", "false");
      });
      objList.classList.remove("has-active");

      if (!isActive) {
        this.classList.add("active");
        this.setAttribute("aria-expanded", "true");
        objList.classList.add("has-active");

        setTimeout(() => {
          this.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        items[index + 1]?.focus();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        items[index - 1]?.focus();
      }
    });
  });
});

const shiftData = {
  server: {
    onTitle: "Mua máy chủ vật lý",
    onText: "Khách hàng phải mua server, chờ giao hàng, lắp vào rack, cấu hình điện, mạng, OS và tự vận hành vòng đời phần cứng.",
    cloudTitle: "Tạo máy ảo trong vài phút",
    cloudText: "Khách hàng thuê năng lực tính toán theo nhu cầu, tăng giảm nhanh và trả tiền theo mức sử dụng thực tế.",
    tip: "Cloud không chỉ là nơi đặt server mới; Cloud là cách tiêu thụ năng lực CNTT linh hoạt hơn."
  },
  storage: {
    onTitle: "Mua SAN/NAS và mở rộng thủ công",
    onText: "Muốn thêm dung lượng thường phải dự báo trước, mua thiết bị, lắp disk, cấu hình RAID và quản lý vòng đời phần cứng.",
    cloudTitle: "Tạo storage theo loại dữ liệu",
    cloudText: "Chọn block, file, object hoặc archive storage theo use case, mở rộng nhanh hơn và dễ gắn với backup, log, data lake.",
    tip: "Hãy hỏi dữ liệu nào cần truy cập nhanh, dữ liệu nào chỉ cần lưu lâu dài để chọn đúng loại storage."
  },
  database: {
    onTitle: "Tự cài và tự chăm database",
    onText: "Đội IT phải lo server, OS, database engine, patching, backup, HA, capacity và monitoring.",
    cloudTitle: "Dùng managed database",
    cloudText: "Cloud provider quản lý nhiều phần nền tảng như patching, backup, HA; khách hàng tập trung hơn vào dữ liệu và ứng dụng.",
    tip: "Managed database thường bán bằng câu chuyện giảm tải vận hành, không chỉ bằng thông số CPU/RAM."
  },
  backup: {
    onTitle: "Đầu tư thiết bị và phần mềm backup",
    onText: "Khách hàng cần storage backup, license, lịch sao lưu, kiểm thử restore và có thể phải xây site dự phòng riêng.",
    cloudTitle: "Dùng backup, snapshot, replication",
    cloudText: "Cloud giúp tạo bản sao, lưu trữ dài hạn và dựng kịch bản DR linh hoạt hơn theo RPO/RTO.",
    tip: "Câu hỏi hay: hệ thống nào cần khôi phục trong vài phút, hệ thống nào có thể chờ vài giờ?"
  },
  security: {
    onTitle: "Tự mua firewall, WAF, SIEM, IAM",
    onText: "Mỗi năng lực bảo mật thường là một sản phẩm riêng, cần triển khai, tích hợp và vận hành liên tục.",
    cloudTitle: "Kết hợp dịch vụ bảo mật của Cloud",
    cloudText: "IAM, logging, key management, WAF, policy và monitoring có thể được bật theo dịch vụ, nhưng cấu hình vẫn là trách nhiệm của khách hàng.",
    tip: "Đừng nói Cloud tự động an toàn; hãy nói Cloud có công cụ tốt hơn để thiết kế và kiểm soát an toàn."
  }
};

document.querySelectorAll("[data-cloud-shift]").forEach((board) => {
  const chips = [...board.querySelectorAll("[data-shift]")];
  const onTitle = board.querySelector("[data-shift-on-title]");
  const onText = board.querySelector("[data-shift-on-text]");
  const cloudTitle = board.querySelector("[data-shift-cloud-title]");
  const cloudText = board.querySelector("[data-shift-cloud-text]");
  const tip = board.querySelector("[data-shift-tip]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const data = shiftData[chip.dataset.shift];
      if (!data) return;
      chips.forEach((current) => {
        current.classList.remove("active");
        current.setAttribute("aria-selected", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-selected", "true");
      onTitle.textContent = data.onTitle;
      onText.textContent = data.onText;
      cloudTitle.textContent = data.cloudTitle;
      cloudText.textContent = data.cloudText;
      tip.textContent = data.tip;
    });
  });
});

const modelData = {
  iaas: {
    title: "IaaS - thuê hạ tầng",
    text: "Phù hợp khi khách hàng muốn migrate nhanh workload hiện hữu, cần kiểm soát OS hoặc có ứng dụng legacy khó chuyển đổi ngay.",
    question: "Ứng dụng có cần kiểm soát hệ điều hành hoặc agent đặc thù không?",
    caution: "Khách hàng vẫn phải vận hành OS, patching, backup và security ở lớp workload.",
    muted: []
  },
  paas: {
    title: "PaaS - thuê nền tảng",
    text: "Phù hợp khi khách hàng muốn giảm vận hành OS, runtime, database engine và tập trung vào ứng dụng, dữ liệu, logic nghiệp vụ.",
    question: "Ứng dụng hoặc database hiện tại có thể chạy trên managed service không?",
    caution: "Cần kiểm tra compatibility, network integration, backup và giới hạn cấu hình của từng dịch vụ.",
    muted: ["runtime", "os"]
  },
  saas: {
    title: "SaaS - thuê phần mềm dùng ngay",
    text: "Phù hợp khi khách hàng cần chức năng nghiệp vụ hoàn chỉnh như email, CRM, ticketing, HRM hoặc collaboration.",
    question: "Quy trình nghiệp vụ có thể thích nghi với phần mềm tiêu chuẩn không?",
    caution: "Cần kiểm tra tính năng, tích hợp SSO, phân quyền, dữ liệu, audit log và compliance.",
    muted: ["app", "runtime", "os"]
  }
};

document.querySelectorAll("[data-model-switcher]").forEach((switcher) => {
  const tabs = [...switcher.querySelectorAll("[data-model]")];
  const title = switcher.querySelector("[data-model-title]");
  const text = switcher.querySelector("[data-model-text]");
  const question = switcher.querySelector("[data-model-question]");
  const caution = switcher.querySelector("[data-model-caution]");
  const layers = [...switcher.querySelectorAll("[data-layer]")];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const data = modelData[tab.dataset.model];
      if (!data) return;
      tabs.forEach((current) => {
        current.classList.remove("active");
        current.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      title.textContent = data.title;
      text.textContent = data.text;
      question.textContent = data.question;
      caution.textContent = data.caution;
      layers.forEach((layer) => {
        layer.classList.toggle("muted", data.muted.includes(layer.dataset.layer));
      });
    });
  });
});

document.querySelectorAll("[data-deployment-picker]").forEach((picker) => {
  picker.querySelectorAll("[data-deploy]").forEach((card) => {
    card.addEventListener("click", () => {
      picker.querySelectorAll("[data-deploy]").forEach((current) => current.classList.remove("active"));
      card.classList.add("active");
    });
  });
});

const serviceData = {
  compute: {
    label: "Compute",
    title: "Nơi chạy workload",
    text: "Ứng dụng, website, API, batch job hoặc backend service cần một lớp xử lý để chạy.",
    examples: ["Virtual Machine", "Container", "Kubernetes", "Serverless Function"],
    question: "Workload hiện tại đang chạy trên VM, physical server hay container?"
  },
  storage: {
    label: "Storage",
    title: "Nơi lưu dữ liệu file, object và disk",
    text: "Cloud chia storage theo mục đích: disk cho VM, file share cho ứng dụng, object cho dữ liệu lớn, archive cho lưu dài hạn.",
    examples: ["Block Storage", "Object Storage", "File Storage", "Archive Storage"],
    question: "Dữ liệu nào cần truy cập thường xuyên, dữ liệu nào chỉ cần lưu trữ lâu dài?"
  },
  database: {
    label: "Database",
    title: "Nơi quản lý dữ liệu có cấu trúc hoặc phi cấu trúc",
    text: "Database có thể tự cài trên VM hoặc dùng managed service để giảm phần vận hành nền tảng.",
    examples: ["SQL on VM", "Managed Database", "NoSQL", "Data Warehouse"],
    question: "Đội IT có muốn giảm việc patching, backup và HA cho database không?"
  },
  networking: {
    label: "Networking",
    title: "Kết nối và phân luồng traffic",
    text: "Networking giúp workload kết nối với nhau, kết nối Internet và kết nối về hệ thống on-premises.",
    examples: ["VPC/VNet", "Subnet", "VPN", "Load Balancer", "DNS", "CDN"],
    question: "Hệ thống Cloud cần kết nối với data center hiện tại qua VPN hay đường riêng?"
  },
  iam: {
    label: "Identity & Access",
    title: "Định danh và phân quyền",
    text: "IAM quyết định ai được truy cập vào tài nguyên nào, với quyền gì và trong điều kiện nào.",
    examples: ["User", "Group", "Role", "MFA", "SSO", "RBAC"],
    question: "Khách hàng đã có SSO, MFA hoặc chính sách phân quyền tập trung chưa?"
  },
  security: {
    label: "Security",
    title: "Bảo mật workload Cloud",
    text: "Cloud là mô hình trách nhiệm chia sẻ: provider bảo vệ nền tảng, khách hàng bảo vệ cấu hình, dữ liệu và ứng dụng.",
    examples: ["Firewall", "WAF", "Key Management", "Policy", "SIEM"],
    question: "Ai đang chịu trách nhiệm cấu hình bảo mật, audit và theo dõi cảnh báo?"
  },
  monitoring: {
    label: "Monitoring",
    title: "Giám sát và vận hành",
    text: "Monitoring gom metric, log, alert, health status, cost và compliance để đội IT thấy hệ thống đang chạy ra sao.",
    examples: ["Metric", "Log", "Alert", "Cost", "Health", "Automation"],
    question: "Khách hàng hiện có dashboard và cảnh báo tập trung cho hệ thống chưa?"
  },
  backup: {
    label: "Backup / DR",
    title: "Khôi phục dữ liệu và dự phòng thảm họa",
    text: "Backup/DR giúp khôi phục khi xóa nhầm, lỗi hệ thống hoặc cần chạy dự phòng sang site/region khác.",
    examples: ["Snapshot", "Backup Vault", "Replication", "Archive", "DR Plan"],
    question: "RPO/RTO mong muốn cho từng hệ thống quan trọng là bao nhiêu?"
  },
  innovation: {
    label: "AI / Data / DevOps",
    title: "Nhóm dịch vụ tạo khác biệt",
    text: "Đây là các năng lực giúp Cloud vượt khỏi câu chuyện hạ tầng: AI, analytics, IoT, CI/CD và automation.",
    examples: ["AI/ML", "Data Lake", "BI", "IoT", "CI/CD", "IaC"],
    question: "Khách hàng có bài toán dữ liệu, tự động hóa hoặc ra mắt sản phẩm nhanh hơn không?"
  }
};

document.querySelectorAll("[data-service-map]").forEach((map) => {
  const nodes = [...map.querySelectorAll("[data-service]")];
  const label = map.querySelector("[data-service-label]");
  const title = map.querySelector("[data-service-title]");
  const text = map.querySelector("[data-service-text]");
  const examples = map.querySelector("[data-service-examples]");
  const question = map.querySelector("[data-service-question]");

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const data = serviceData[node.dataset.service];
      if (!data) return;
      nodes.forEach((current) => {
        current.classList.remove("active");
        current.setAttribute("aria-selected", "false");
      });
      node.classList.add("active");
      node.setAttribute("aria-selected", "true");
      label.textContent = data.label;
      title.textContent = data.title;
      text.textContent = data.text;
      examples.innerHTML = data.examples.map((item) => `<span>${item}</span>`).join("");
      question.textContent = data.question;
    });
  });
});

const firstObjectiveList = document.getElementById("objList");

if (firstObjectiveList) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const first = firstObjectiveList.querySelector(".obj-item");
      if (!first) return;

      first.style.borderColor = "rgba(0, 120, 212, 0.3)";
      first.style.boxShadow = "0 0 0 3px rgba(0, 120, 212, 0.08)";

      setTimeout(() => {
        first.style.borderColor = "";
        first.style.boxShadow = "";
      }, 1200);
    }, 900);
  });

  try {
    const visited = JSON.parse(localStorage.getItem("cloud_training_visited") || "{}");
    visited.section1 = true;
    visited.section1_ts = Date.now();
    localStorage.setItem("cloud_training_visited", JSON.stringify(visited));
  } catch {
    // Local storage can be unavailable in some locked-down browsers.
  }
}

function decodeHtmlEntities(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function formatInline(value) {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => formatInline(cell.trim()));
}

function renderMarkdown(markdown) {
  const bodyMarkdown = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const lines = bodyMarkdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listType = null;
  let sectionOpen = false;
  let sectionCount = 0;

  function closeList() {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  }

  function closeSection() {
    closeList();
    if (sectionOpen) {
      html.push("</div></section>");
      sectionOpen = false;
    }
  }

  function openSection(level, title) {
    closeSection();
    sectionCount += 1;
    const levelClass = `level-${Math.min(level, 4)}`;

    html.push(`
      <section class="md-section ${levelClass} open">
        <button class="md-section-toggle" type="button" aria-expanded="true">
          <span class="md-section-kicker">Phần ${String(sectionCount).padStart(2, "0")}</span>
          <span class="md-section-title">${formatInline(title)}</span>
          <span class="md-section-icon" aria-hidden="true">⌄</span>
        </button>
        <div class="md-section-content">
    `);
    sectionOpen = true;
  }

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    if (line === "---") {
      closeList();
      html.push("<hr>");
      continue;
    }

    if (line.includes("|") && lines[i + 1] && isTableDivider(lines[i + 1])) {
      closeList();
      const headerCells = parseTableRow(line).map((cell) => `<th>${cell}</th>`).join("");
      const rows = [];
      i += 2;

      while (i < lines.length && lines[i].trim().includes("|")) {
        const rowCells = parseTableRow(lines[i]).map((cell) => `<td>${cell}</td>`).join("");
        rows.push(`<tr>${rowCells}</tr>`);
        i += 1;
      }

      i -= 1;
      html.push(`<div class="md-table-card"><div class="table-wrap"><table><thead><tr>${headerCells}</tr></thead><tbody>${rows.join("")}</tbody></table></div></div>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 4);
      openSection(level, headingMatch[2]);
      continue;
    }

    if (line.startsWith(">")) {
      closeList();
      html.push(`<blockquote>${formatInline(line.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${formatInline(unorderedMatch[1])}</li>`);
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${formatInline(orderedMatch[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${formatInline(line)}</p>`);
  }

  closeList();
  closeSection();
  return html.join("");
}

document.querySelectorAll("[data-markdown-source]").forEach((target) => {
  const source = document.getElementById(target.dataset.markdownSource);
  if (!source) return;

  const markdown = decodeHtmlEntities(source.textContent || "");
  target.innerHTML = renderMarkdown(markdown);
});

document.querySelectorAll(".md-section-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const section = toggle.closest(".md-section");
    const isOpen = section.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});
