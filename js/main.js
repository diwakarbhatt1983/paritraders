document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  var filterBar = document.querySelector(".filters");

  if (filterBar) {
    var cards = document.querySelectorAll("[data-tier]");

    filterBar.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-filter]");
      if (!button) return;

      filterBar.querySelectorAll("button").forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      var value = button.getAttribute("data-filter");

      cards.forEach(function (card) {
        var matches = value === "all" || card.getAttribute("data-tier") === value;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  }

  var form = document.getElementById("customer-form");

  if (form) {
    var success = document.querySelector(".form-success");
    var summary = document.querySelector(".summary");

    var validators = {
      name: function (value) {
        if (value.trim().length < 2) return "Please enter your full name.";
        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value.trim())) return "Name can only contain letters and spaces.";
        return "";
      },
      phone: function (value) {
        var digits = value.replace(/\D/g, "");
        if (!digits) return "Please enter your phone number.";
        if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number.";
        return "";
      },
      quality: function (value) {
        return value ? "" : "Please select a product quality.";
      },
      product: function (value) {
        return value ? "" : "Please select a product category.";
      },
      quantity: function (value) {
        if (!value) return "";
        return Number(value) > 0 ? "" : "Quantity must be at least 1.";
      }
    };

    function validateField(input) {
      var rule = validators[input.name];
      if (!rule) return true;

      var message = rule(input.value);
      var field = input.closest(".field");
      var error = field.querySelector(".error");

      field.classList.toggle("has-error", Boolean(message));
      if (error) error.textContent = message;
      input.setAttribute("aria-invalid", message ? "true" : "false");

      return !message;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      if (!validators[input.name]) return;

      input.addEventListener("blur", function () {
        validateField(input);
      });

      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("has-error")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstInvalid = null;

      form.querySelectorAll("input, select, textarea").forEach(function (input) {
        if (!validators[input.name]) return;
        var valid = validateField(input);
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var data = new FormData(form);

      summary.innerHTML = "";
      [
        ["Name", data.get("name")],
        ["Phone", data.get("phone")],
        ["Product", data.get("product")],
        ["Quality", data.get("quality")],
        ["Quantity", data.get("quantity") || "Not specified"]
      ].forEach(function (row) {
        var line = document.createElement("div");
        var label = document.createElement("strong");
        var value = document.createElement("span");
        label.textContent = row[0];
        value.textContent = row[1];
        line.appendChild(label);
        line.appendChild(value);
        summary.appendChild(line);
      });

      form.reset();
      form.style.display = "none";
      success.classList.add("show");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", function () {
      form.querySelectorAll(".field").forEach(function (field) {
        field.classList.remove("has-error");
      });
      form.querySelectorAll(".error").forEach(function (error) {
        error.textContent = "";
      });
    });

    var sendAnother = document.querySelector("[data-send-another]");

    if (sendAnother) {
      sendAnother.addEventListener("click", function () {
        success.classList.remove("show");
        form.style.display = "";
        form.querySelector("input").focus();
      });
    }
  }
});
