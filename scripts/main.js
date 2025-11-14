"use strict";
! function () {
  window.signatures = {
    init: function () {
      this.initializePhoneFieldVisibility();
      this.liveForm(), this.clipboard()
    },
    initializePhoneFieldVisibility: function () {
      // Hide phone fields that are empty or unchecked on page load
      var phoneFields = ['telephone', 'direct', 'cell', 'fax'];
      for (var i = 0; i < phoneFields.length; i++) {
        var fieldId = phoneFields[i];
        var value = $("#" + fieldId).val() || '';
        var cleaned = value.replace(/\D/g, '');
        var checkboxId = 'include-' + fieldId;
        var isChecked = $('#' + checkboxId).is(':checked');
        var parentTds = $(".signature td." + fieldId + ", .reply-signature td." + fieldId);
        if (parentTds.length > 0) {
          if (cleaned.length === 0 || !isChecked) {
            parentTds.hide();
          } else {
            parentTds.show();
          }
        }
        // Hide input field if checkbox is unchecked
        if (!isChecked) {
          $('#' + fieldId).hide();
        }
      }
    },
    formatPhoneNumber: function (phone) {
      // Remove all non-digits
      var cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return '(' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
      }
      return phone;
    },
    updatePhoneField: function (fieldId) {
      // Find the element with the phone number in both main and reply signatures
      var numberElements = $(".signature ." + fieldId + "-number, .reply-signature ." + fieldId + "-number");
      
      if (numberElements.length === 0) {
        console.warn("Could not find element with selector: .signature ." + fieldId + "-number or .reply-signature ." + fieldId + "-number");
        return;
      }
      
      // Get the value - read directly from input
      var value = $("#" + fieldId).val() || '';
      var cleaned = value.replace(/\D/g, '');
      var formatted = '';
      
      // Format the phone number
      if (cleaned.length === 10) {
        formatted = '(' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
      } else if (cleaned.length > 0) {
        formatted = value;
      }
      
      // Update the phone number text in all signatures
      if (formatted) {
        numberElements.text(formatted);
      } else {
        // No value - restore default
        numberElements.text('(111) 222-3333');
      }
      
      // Hide/show the parent td element based on whether there's a value AND whether the checkbox is checked
      var checkboxId = 'include-' + fieldId;
      var isChecked = $('#' + checkboxId).is(':checked');
      
      numberElements.each(function() {
        var parentTd = $(this).closest('td.' + fieldId);
        if (cleaned.length === 0 || !isChecked) {
          // Field is empty OR checkbox is unchecked - hide the entire phone field td
          parentTd.hide();
        } else {
          // Field has value AND checkbox is checked - show the phone field td
          parentTd.show();
        }
      });
    },
    updateField: function (i) {
      var e = $("#" + i).val(),
        n = document.querySelectorAll(".signature-row ." + i),
        t = document.querySelectorAll(".signature-row ." + i + "-link");
      if (n && t)
        for (var a = 0; a < n.length; a++) e.length > 0 ? (t[a].setAttribute("href", "tel:" + e)) : t[a].setAttribute("href", "#");
    },
    liveForm: function () {
      // Handle checkbox changes - hide/show input fields
      $('#include-telephone').change(function() {
        if ($(this).is(':checked')) {
          $('#telephone').show();
        } else {
          $('#telephone').hide();
          window.signatures.updatePhoneField("telephone");
        }
      });
      $('#include-direct').change(function() {
        if ($(this).is(':checked')) {
          $('#direct').show();
        } else {
          $('#direct').hide();
          window.signatures.updatePhoneField("direct");
        }
      });
      $('#include-cell').change(function() {
        if ($(this).is(':checked')) {
          $('#cell').show();
        } else {
          $('#cell').hide();
          window.signatures.updatePhoneField("cell");
        }
      });
      $('#include-fax').change(function() {
        if ($(this).is(':checked')) {
          $('#fax').show();
        } else {
          $('#fax').hide();
          window.signatures.updatePhoneField("fax");
        }
      });
      
      $(".signature-form input, .signature-form textarea").keyup(function () {
        var i = $(this).attr("id"),
          e = $(this).val();

        // Handle phone fields immediately on keyup
        if (i == "telephone") {
          window.signatures.updatePhoneField("telephone");
          return;
        } else if (i == "direct") {
          window.signatures.updatePhoneField("direct");
          return;
        } else if (i == "cell") {
          window.signatures.updatePhoneField("cell");
          return;
        } else if (i == "fax") {
          window.signatures.updatePhoneField("fax");
          return;
        } else if (i == "address-1" || i == "address-2") {
          // Convert line breaks to <br> for address fields
          var addressWithBreaks = e.replace(/\n/g, '<br>');
          $(".signature ." + i + ", .reply-signature ." + i).html(addressWithBreaks);
          return;
        }

        if (i == "email") {
          // Update email address and mailto link
          var emailValue = $("#email").val() || '';
          // Use the event value if available, otherwise get from field
          if (e && e.length > 0) {
            emailValue = e;
          }
          
          if (emailValue.length > 0) {
            $(".signature .email, .reply-signature .email").text(emailValue);
            $(".signature .email-link, .reply-signature .email-link").attr("href", "mailto:" + emailValue);
          } else {
            $(".signature .email, .reply-signature .email").text("myemail@mail.com");
            $(".signature .email-link, .reply-signature .email-link").attr("href", "mailto:");
          }
        } else if (i == "pronouns") {
          e.length > 0 ? $(".signature ." + i + ", .reply-signature ." + i).text(e) : $(".signature ." + i + ", .reply-signature ." + i).text("");
        } else {
          // Handle name and title normally
          $(".signature ." + i + ",.reply-signature ." + i).text(e);
        }

      }), $(".signature-form input, .signature-form textarea").on('input', function () {
        var i = $(this).attr("id"),
          e = $(this).val();
        // Update phone fields on input event as well (catches paste, etc.)
        if (i == "telephone") {
          window.signatures.updatePhoneField("telephone");
        } else if (i == "direct") {
          window.signatures.updatePhoneField("direct");
        } else if (i == "cell") {
          window.signatures.updatePhoneField("cell");
        } else if (i == "fax") {
          window.signatures.updatePhoneField("fax");
        } else if (i == "address-1" || i == "address-2") {
          // Convert line breaks to <br> for address fields
          var addressWithBreaks = e.replace(/\n/g, '<br>');
          $(".signature ." + i + ", .reply-signature ." + i).html(addressWithBreaks);
        } else if (i == "email") {
          // Update email address and mailto link
          var emailValue = $("#email").val() || '';
          // Use the event value if available
          if (e && e.length > 0) {
            emailValue = e;
          }
          
          if (emailValue.length > 0) {
            $(".signature .email, .reply-signature .email").text(emailValue);
            $(".signature .email-link, .reply-signature .email-link").attr("href", "mailto:" + emailValue);
          } else {
            $(".signature .email, .reply-signature .email").text("myemail@mail.com");
            $(".signature .email-link, .reply-signature .email-link").attr("href", "mailto:");
          }
        } else if (i == "pronouns") {
          e.length > 0 ? $(".signature ." + i + ", .reply-signature ." + i).text(e) : $(".signature ." + i + ", .reply-signature ." + i).text("");
        } else {
          // Handle name and title normally
          $(".signature ." + i + ",.reply-signature ." + i).text(e);
        }

      }), $(".signature-form input, .signature-form textarea").blur(function () {
        var i = $(this).attr("id"),
        e = $(this).val();

        // Handle phone fields on blur (after Cleave has formatted)
        if (i == "telephone") {
          window.signatures.updatePhoneField("telephone");
        } else if (i == "direct") {
          window.signatures.updatePhoneField("direct");
        } else if (i == "cell") {
          window.signatures.updatePhoneField("cell");
        } else if (i == "fax") {
          window.signatures.updatePhoneField("fax");
        } else if (i == "address-1" || i == "address-2") {
          // Convert line breaks to <br> for address fields
          var addressWithBreaks = e.replace(/\n/g, '<br>');
          $(".signature ." + i + ", .reply-signature ." + i).html(addressWithBreaks);
        } else if (i == "email") {
          // Update email address and mailto link
          var emailValue = $("#email").val() || '';
          // Use the event value if available
          if (e && e.length > 0) {
            emailValue = e;
          }
          
          if (emailValue.length > 0) {
            $(".signature .email, .reply-signature .email").text(emailValue);
            $(".signature .email-link, .reply-signature .email-link").attr("href", "mailto:" + emailValue);
          } else {
            $(".signature .email, .reply-signature .email").text("myemail@mail.com");
            $(".signature .email-link, .reply-signature .email-link").attr("href", "mailto:");
          }
        } else if (i == "pronouns") {
          e.length > 0 ? $(".signature ." + i + ", .reply-signature ." + i).text(e) : $(".signature ." + i + ", .reply-signature ." + i).text("");
        } else {
          // Handle name and title normally
          $(".signature ." + i + ",.reply-signature ." + i).text(e);
        }

      });
      // Phone number formatters - format as (XXX) XXX-XXXX
      // Using blocks and delimiters instead of phone type to avoid requiring additional formatter files
      new Cleave("#telephone", {
        blocks: [3, 3, 4],
        delimiters: ['-'],
        numericOnly: true,
        onValueChanged: function (formattedValue) {
          window.signatures.updatePhoneField("telephone");
        }
      });
      new Cleave("#direct", {
        blocks: [3, 3, 4],
        delimiters: ['-'],
        numericOnly: true,
        onValueChanged: function (formattedValue) {
          window.signatures.updatePhoneField("direct");
        }
      });
      new Cleave("#cell", {
        blocks: [3, 3, 4],
        delimiters: ['-'],
        numericOnly: true,
        onValueChanged: function (formattedValue) {
          window.signatures.updatePhoneField("cell");
        }
      });
      new Cleave("#fax", {
        blocks: [3, 3, 4],
        delimiters: ['-'],
        numericOnly: true,
        onValueChanged: function (formattedValue) {
          window.signatures.updatePhoneField("fax");
        }
      })
    },
    clipboard: function () {
      ClipboardJS.isSupported() || ($(".no-clip").css("display", "block"), $(".yes-clip").css("display", "none")), new ClipboardJS(".btn.copy")
    },
    toggleSignatureVersion: function () {
      var i = "pc",
        e = $(".pc-version-button"),
        n = $(".mac-version-button"),
        t = $(".pc-version-copy"),
        a = $(".mac-version-copy");
      e.click(function () {
        "pc" !== i && (a.css("display", "none"), t.css("display", "block"), i = "pc", e.addClass("active"), n.removeClass("active"))
      }), n.click(function () {
        "mac" !== i && (a.css("display", "block"), t.css("display", "none"), i = "mac", e.removeClass("active"), n.addClass("active"))
      })
    }
  }, $(window.document).ready(function () {
    window.signatures.init()
  })
}();