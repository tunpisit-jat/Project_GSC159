/* ============================================================
   Agoda Prototype — main.js
   Handles: page navigation, search tab switching,
   Flexi-Predict modal with 6-step walkthrough
   ============================================================ */

'use strict';

// ── Page navigation ──────────────────────────────────────────
function goToBookings() {
  window.location.href = 'bookings.html';
}

function goToHome() {
  window.location.href = 'index.html';
}

// ── Profile dropdown ──────────────────────────────────────────
function toggleProfileDropdown() {
  var dropdown = document.getElementById('profile-dropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
}

document.addEventListener('click', function (e) {
  var wrapper = document.getElementById('profile-dropdown-wrapper');
  var dropdown = document.getElementById('profile-dropdown');
  if (wrapper && dropdown && !wrapper.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// ── Destination card scroll ───────────────────────────────────
function scrollDestinations(dir) {
  var el = document.getElementById('destinations-scroll');
  if (!el) return;
  el.scrollBy({ left: dir === 'left' ? -620 : 620, behavior: 'smooth' });
  setTimeout(updateDestArrows, 400);
}

function updateDestArrows() {
  var el   = document.getElementById('destinations-scroll');
  var prev = document.getElementById('dest-prev');
  var next = document.getElementById('dest-next');
  if (!el || !prev || !next) return;
  prev.style.display = el.scrollLeft <= 4 ? 'none' : 'flex';
  next.style.display = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 ? 'none' : 'flex';
}

// ── Search tabs ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // Destination carousel
  var destScroll = document.getElementById('destinations-scroll');
  if (destScroll) {
    destScroll.addEventListener('scroll', updateDestArrows);
    updateDestArrows();
  }

  // Search tab switching
  document.querySelectorAll('.search-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.search-tab').forEach(function (b) {
        b.classList.remove('active-tab', 'text-agoda-blue', 'font-semibold');
        b.classList.add('text-gray-600', 'font-medium');
      });
      btn.classList.add('active-tab');
      btn.classList.remove('text-gray-600', 'font-medium');
      btn.classList.add('text-agoda-blue', 'font-semibold');
    });
  });

  // Stay type toggle
  var overnight = document.getElementById('toggle-overnight');
  var dayStay   = document.getElementById('toggle-day');
  if (overnight && dayStay) {
    function setToggle(active, inactive) {
      active.classList.add('active-toggle');
      active.classList.remove('border-gray-300', 'text-gray-600');
      inactive.classList.remove('active-toggle');
      inactive.classList.add('border-gray-300', 'text-gray-600');
    }
    overnight.addEventListener('click', function () { setToggle(overnight, dayStay); });
    dayStay.addEventListener('click',   function () { setToggle(dayStay, overnight); });
  }

  // Booking status tabs
  document.querySelectorAll('.booking-status-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.booking-status-tab').forEach(function (t) {
        t.classList.remove('border-agoda-blue', 'text-agoda-blue', 'font-semibold');
        t.classList.add('border-transparent', 'text-gray-500');
      });
      tab.classList.remove('border-transparent', 'text-gray-500');
      tab.classList.add('border-agoda-blue', 'text-agoda-blue', 'font-semibold');
    });
  });

});

// ── Date/guest picker placeholders (UI only) ─────────────────
function openDatePicker() {
  // Visual-only; real implementation would open a calendar widget
  var el = event.currentTarget;
  if (el) {
    el.style.borderColor = '#005999';
    el.style.boxShadow = '0 0 0 2px rgba(0,89,153,0.15)';
    setTimeout(function () {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 600);
  }
}

function openGuestPicker() {
  // Placeholder
}

// ============================================================
//  FLEXI-PREDICT MODAL — 6-step walkthrough
// ============================================================

var currentStep = 1;
var totalSteps  = 6;
var matchingTimer = null;

function clearMatchingTimer() {
  if (matchingTimer) { clearTimeout(matchingTimer); matchingTimer = null; }
}

var stepMeta = [
  { num: 1, name: 'การจองของฉัน' },
  { num: 2, name: 'AI แจ้งเตือน' },
  { num: 3, name: 'เปิดขายสิทธิ์' },
  { num: 4, name: 'AI กำลังจับคู่' },
  { num: 5, name: 'พบผู้รับสิทธิ์' },
  { num: 6, name: 'เงินคืนสำเร็จ' },
];

// HTML content for each step
var stepContent = {

  // ── Step 1: My booking card (clean) ─────────────────────
  1: `
    <div class="step-animate">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="h-52 relative" style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 50%,#1e40af 100%)">
          <div class="h-52 overflow-hidden">
          <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/43/15/3b/andaman-white-beach-resort.jpg?w=900&h=500&s=1"
           alt="Andaman Bay Resort" class="w-full h-full object-cover" />
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-bold text-gray-800">Andaman Bay Resort</h3>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-yellow-400 text-xs">★★★★</span>
                <span class="text-xs text-gray-400">4.5 · ดีเยี่ยม · 1,203 รีวิว</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400">ราคารวม</div>
              <div class="font-bold text-lg text-[#005999]">฿8,400</div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs p-3 bg-[#f3f5f8] rounded-lg mb-3">
            <div class="text-center">
              <div class="text-gray-400 mb-0.5">เช็คอิน</div>
              <div class="font-bold text-gray-700">4 ก.ค. 2569</div>
              <div class="text-gray-400">เสาร์</div>
            </div>
            <div class="flex items-center justify-center text-gray-300">→</div>
            <div class="text-center">
              <div class="text-gray-400 mb-0.5">เช็คเอาท์</div>
              <div class="font-bold text-gray-700">7 ก.ค. 2569</div>
              <div class="text-gray-400">อังคาร · 3 คืน</div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Deluxe Sea View Room · 2 ผู้ใหญ่ · รวมอาหารเช้า
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#1967d2] flex items-center justify-center flex-shrink-0">
              <svg
                class="w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor">
                <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-[#1967d2] text-xs">มีตัวเลือกโอนสิทธิ์ห้องพัก</div>
              <div class="text-blue-700 text-[11px] mt-0.5">กดถัดไปเพื่อดูรายละเอียดและรับเงินคืนสูงสุด 90%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  // ── Step 2: Choose action ────────────────────────────────
  2: `
    <div class="step-animate">
      <h2 class="font-bold text-gray-800 text-base mb-1">ต้องการทำอะไรกับการจองนี้?</h2>
      <p class="text-sm text-gray-500 mb-4">เลือกตัวเลือกที่เหมาะกับคุณ</p>

      <div class="space-y-3">
        <div class="border-2 border-[#1967d2] rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition relative overflow-hidden" onclick="nextStep()">
          <div class="absolute top-2 right-2 bg-[#1967d2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">แนะนำ</div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg
                class="w-5 h-5 text-[#1967d2]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor">
                <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
              </svg>
            </div>
            <div>
              <div class="font-bold text-gray-800 text-sm">โอนสิทธิ์ห้องพักผ่าน Flexi-Swap</div>
              <div class="text-xs text-gray-600 mt-0.5">รับเงินคืนสูงสุด <strong class="text-green-600">90%</strong> (฿7,560) เข้า Agoda Wallet</div>
              <div class="text-[11px] text-[#1967d2] mt-1">ไม่มีค่าใช้จ่ายเพิ่มเติม · ดำเนินการอัตโนมัติ</div>
            </div>
          </div>
        </div>

        <div class="border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition flex items-center gap-3 opacity-70">
          <div class="w-10 h-10 rounded-xl bg-[#f3f5f8] flex items-center justify-center flex-shrink-0">
            <svg
              class="w-6 h-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor">
              <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z"/>
            </svg>
          </div>
          <div>
            <div class="font-medium text-gray-700 text-sm">ยกเลิกการจองตามปกติ</div>
            <div class="text-xs text-red-500">ได้รับเงินคืน 0% — สูญเสีย ฿8,400</div>
          </div>
        </div>

        <div class="border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition flex items-center gap-3 opacity-70">
          <div class="w-10 h-10 rounded-xl bg-[#f3f5f8] flex items-center justify-center flex-shrink-0">
            <svg
              class="w-6 h-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor"
            >
              <path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/>
            </svg>
          </div>
          <div>
            <div class="font-medium text-gray-700 text-sm">เปลี่ยนวันเดินทาง</div>
            <div class="text-xs text-gray-500">ขึ้นอยู่กับนโยบายของที่พัก</div>
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-400 text-center mt-4">กดตัวเลือกด้านบนเพื่อดำเนินการต่อ</p>
    </div>
  `,

  // ── Step 3: Compare cancel vs swap ──────────────────────
  3: `
    <div class="step-animate">
      <h2 class="font-bold text-gray-800 text-base mb-4">เปรียบเทียบตัวเลือก</h2>

      <div class="grid grid-cols-2 gap-3 mb-5">
        <div class="rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
          <div class="text-center mb-3">
            <div class="mb-1">
              <svg
                class="w-8 h-8 text-red-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor">
                <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z"/>
              </svg>
            </div>
            <div class="font-bold text-red-700 text-sm">ยกเลิกตามปกติ</div>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2 text-red-600"><span>✗</span><span>ได้เงินคืน <strong>0%</strong></span></div>
            <div class="flex items-center gap-2 text-red-600"><span>✗</span><span>เสีย <strong>฿8,400</strong> ทันที</span></div>
            <div class="flex items-center gap-2 text-red-600"><span>✗</span><span>ไม่มีผลประโยชน์ใดๆ</span></div>
          </div>
          <div class="mt-4 p-2 bg-red-100 rounded-lg text-center">
            <div class="text-xs text-red-500 font-medium">คุณได้รับ</div>
            <div class="text-2xl font-extrabold text-red-600">฿0</div>
          </div>
        </div>

        <div class="rounded-xl border-2 border-[#1967d2] bg-blue-50 p-4 relative shadow-md">
          <div class="absolute -top-2.5 left-1/2 -translate-x-1/2">
            <span class="bg-[#1967d2] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">แนะนำ</span>
          </div>
          <div class="text-center mb-3 mt-1">
            <div class="mb-1 flex justify-center">
              <svg
                class="w-8 h-8 text-[#1967d2]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor">
                <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
              </svg>
            </div>
            <div class="font-bold text-[#1967d2] text-sm">โอนสิทธิ์ Flexi-Swap</div>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2 text-green-600"><span>✓</span><span>ได้เงินคืน <strong>สูงสุด 90%</strong></span></div>
            <div class="flex items-center gap-2 text-green-600"><span>✓</span><span>เข้า Agoda Wallet ทันที</span></div>
            <div class="flex items-center gap-2 text-green-600"><span>✓</span><span>ดำเนินการอัตโนมัติ</span></div>
            <div class="flex items-center gap-2 text-green-600"><span>✓</span><span>ไม่มีค่าใช้จ่ายเพิ่มเติม</span></div>
          </div>
          <div class="mt-4 p-2 bg-blue-100 rounded-lg text-center">
            <div class="text-xs text-[#1967d2] font-medium">คุณได้รับ</div>
            <div class="text-2xl font-extrabold text-green-600">฿7,560</div>
            <div class="text-[10px] text-gray-500">90% จาก ฿8,400</div>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
        <div class="flex items-start gap-2">
          <svg
              class="w-5 h-5 text-blue-500 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor">
              <path d="M320 496C342.1 496 360 513.9 360 536C360 558.1 342.1 576 320 576C297.9 576 280 558.1 280 536C280 513.9 297.9 496 320 496zM320 64C346.5 64 368 85.5 368 112C368 112.6 368 113.1 368 113.7L352 417.7C351.1 434.7 337 448 320 448C303 448 289 434.7 288 417.7L272 113.7C272 113.1 272 112.6 272 112C272 85.5 293.5 64 320 64z"/>
            </svg>
          <div class="text-xs text-blue-700">
            <strong>เงื่อนไข Flexi-Swap:</strong> เงินคืน 90% จะเข้า Wallet เมื่อจับคู่ผู้รับสิทธิ์สำเร็จ ซึ่งปกติใช้เวลาไม่เกิน 24 ชั่วโมง หากไม่สำเร็จภายใน 72 ชั่วโมง จะคืนตามนโยบายปกติของที่พัก
          </div>
        </div>
      </div>

      <button onclick="nextStep()" class="w-full bg-[#1967d2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md text-sm flex items-center justify-center gap-2">
        ยืนยัน — โอนสิทธิ์ห้องพักผ่าน Flexi-Swap
      </button>
    </div>
  `,

  // ── Step 4: Matching / loading ───────────────────────────
  4: `
      <div class="step-animate">
        <h2 class="font-bold text-gray-800 text-base mb-5">
          กำลังค้นหาผู้รับสิทธิ์
        </h2>
          <div class="flex flex-col items-center py-6">
            <!-- Rotating Icon -->
            <svg
              class="w-10 h-10 text-[#1967d2] animate-spin mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor">
              <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
            </svg>
            <div class="font-bold text-gray-700 mb-2">
              กำลังจับคู่ผู้รับสิทธิ์
            </div>
            <div class="dot-bounce">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="text-xs text-gray-400 mt-2">
              ค้นหาผู้สนใจภูเก็ตช่วง 4–7 ก.ค.
            </div>
          </div>
      </div>
      <div class="bg-[#f3f5f8] rounded-xl p-4 mb-4">
        <div class="font-semibold text-gray-700 text-sm mb-3">เกณฑ์การจับคู่</div>
        <div class="space-y-2.5" id="criteria-list">
          <div class="matching-criteria flex items-center gap-3 text-xs opacity-0 transition-opacity duration-300" style="animation-delay:0.2s">
            <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </div>
            <span class="text-gray-600">ช่วงวันที่ตรงกัน: <strong>4–7 ก.ค. 2569</strong></span>
          </div>
          <div class="matching-criteria flex items-center gap-3 text-xs opacity-0 transition-opacity duration-300" style="animation-delay:0.6s">
            <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </div>
            <span class="text-gray-600">ราคาต่ำกว่าตลาด: <strong>18%</strong></span>
          </div>
          <div class="matching-criteria flex items-center gap-3 text-xs opacity-0 transition-opacity duration-300" style="animation-delay:1s">
            <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </div>
            <span class="text-gray-600">ประเภทห้อง: <strong>Deluxe Sea View Room</strong></span>
          </div>
          <div class="matching-criteria flex items-center gap-3 text-xs opacity-0 transition-opacity duration-300" style="animation-delay:1.4s">
            <div class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-[#1967d2] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <span class="text-gray-600 animate-pulse">ค้นหาในฐานข้อมูล 2.4 ล้านผู้ใช้...</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="bg-blue-50 rounded-xl p-2.5">
          <div class="font-bold text-[#1967d2] text-base" id="counter-users">0</div>
          <div class="text-[10px] text-gray-500">ผู้ใช้ที่ตรงเงื่อนไข</div>
        </div>
        <div class="bg-[#f3f5f8] rounded-xl p-2.5">
          <div class="font-bold text-gray-700 text-base">0.3s</div>
          <div class="text-[10px] text-gray-500">เวลาประมวลผล</div>
        </div>
        <div class="bg-green-50 rounded-xl p-2.5">
          <div class="font-bold text-green-600 text-base">94%</div>
          <div class="text-[10px] text-gray-500">อัตราจับคู่สำเร็จ</div>
        </div>
      </div>
    </div>
  `,

  // ── Step 5: Match found + confirm ────────────────────────
  5: `
    <div class="step-animate">
      <h2 class="font-bold text-gray-800 text-base mb-4">พบผู้รับสิทธิ์แล้ว!</h2>

      <div class="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg
              class="w-5 h-5 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor">
              <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
            </svg>
          </div>
          <div>
            <div class="font-bold text-gray-800 text-sm">จับคู่สำเร็จ</div>
            <div class="text-xs text-gray-500">พบผู้รับสิทธิ์ 3 ราย · ใช้เวลา 0.3 วินาที</div>
          </div>
          <span class="ml-auto bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">● พร้อมโอน</span>
        </div>

        <div class="bg-[#f3f5f8] rounded-xl p-3 mb-4">
          <div class="text-xs font-semibold text-gray-600 mb-2">ผู้รับสิทธิ์ (ข้อมูลส่วนตัวถูกปกปิด)</div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">K</div>
            <div class="flex-1">
              <div class="font-medium text-gray-800 text-sm">คุณ K***a S.</div>
              <div class="text-xs text-gray-500">กรุงเทพ · Agoda Silver Member</div>
            </div>
            <div class="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">ยืนยันแล้ว ✓</div>
          </div>
        </div>

        <div class="space-y-2 text-sm mb-4">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-500">มูลค่าห้องพักเดิม</span>
            <span class="font-semibold text-gray-700">฿8,400</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-500">ค่าธรรมเนียม Flexi-Swap (10%)</span>
            <span class="font-semibold text-red-500">-฿840</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="font-bold text-gray-700">คุณได้รับเงินคืน</span>
            <span class="font-extrabold text-green-600 text-xl">฿7,560</span>
          </div>
        </div>

        <button onclick="nextStep()" class="w-full bg-[#1967d2] hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md text-sm flex items-center justify-center gap-2">
          ✓ ยืนยันโอนสิทธิ์ รับเงินคืน ฿7,560
        </button>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="text-xs font-semibold text-gray-600 mb-3">ขั้นตอนต่อไป</div>
        <div class="space-y-2 text-xs">
          <div class="flex items-center gap-2 text-green-600">
            <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">✓</div>
            <span>จับคู่ผู้รับสิทธิ์สำเร็จ</span>
          </div>
          <div class="flex items-center gap-2 text-[#1967d2]">
            <div class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">→</div>
            <span>โอนสิทธิ์การจองให้ผู้รับ</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">○</div>
            <span>เงินคืนเข้า Agoda Wallet ของคุณ</span>
          </div>
        </div>
      </div>
    </div>
  `,

  // ── Step 6: Success ───────────────────────────────────────
  6: `
    <div class="step-animate">
      <div class="text-center py-2">
        <div class="w-14 h-14 mx-auto mb-2 relative scale-in">
          <div class="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" class="check-animated"/>
            </svg>
          </div>
        </div>

        <h2 class="text-lg font-extrabold text-gray-800 mb-1 mt-7">โอนสิทธิ์สำเร็จ!</h2>
        <p class="text-gray-500 text-sm mb-4">เงินเข้า Agoda Wallet ของคุณแล้ว</p>

        <div class="grid grid-cols-2 gap-3 mb-3 text-left">
          <div class="bg-gradient-to-br from-[#1967d2] to-blue-800 rounded-2xl p-3 text-white shadow-md shadow-blue-100 scale-in">
            <div class="text-[10px] text-blue-300 mb-0.5">Agoda Wallet</div>
            <div class="text-2xl font-extrabold mb-0.5">฿7,560</div>
            <div class="text-[10px] text-blue-200">โอนเข้าเรียบร้อย · วันนี้</div>
            <div class="mt-2 pt-2 border-t border-blue-500/60 flex justify-between items-center text-[10px]">
              <span class="text-blue-300">ยอดรวมใน Wallet</span>
              <span class="font-bold text-white">฿7,560</span>
            </div>
          </div>

          <div class="bg-[#f3f5f8] rounded-xl p-3">
            <div class="text-[10px] font-bold text-gray-600 mb-1.5 text-center">สรุปธุรกรรม Flexi-Swap</div>
            <div class="space-y-1 text-[10px]">
              <div class="flex justify-between"><span class="text-gray-500">ที่พัก</span><span class="font-medium">Andaman Bay</span></div>
              <div class="flex justify-between"><span class="text-gray-500">วันที่</span><span class="font-medium">4–7 ก.ค. 2569</span></div>
              <div class="flex justify-between"><span class="text-gray-500">มูลค่าเดิม</span><span class="font-medium">฿8,400</span></div>
              <div class="flex justify-between"><span class="text-gray-500">ค่าบริการ (10%)</span><span class="text-red-500 font-medium">-฿840</span></div>
              <div class="flex justify-between font-bold border-t border-gray-200 pt-1 mt-0.5">
                <span class="text-green-600">เงินที่ได้รับ</span>
                <span class="text-green-600">฿7,560</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button onclick="closeFlexiModal()" class="flex-1 bg-[#1967d2] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-sm">
            ใช้เงินใน Wallet จองที่พักใหม่
          </button>
          <button onclick="closeFlexiModal()" class="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition text-sm">
            กลับหน้าการจอง
          </button>
        </div>
      </div>
    </div>
  `,
};

// ── Open modal ─────────────────────────────────────────────────
function startFlexiFlow() {
  currentStep = 1;
  document.getElementById('flexi-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderStep(1);
}

function closeFlexiModal() {
  clearMatchingTimer();
  document.getElementById('flexi-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ── Render a step ──────────────────────────────────────────────
function renderStep(n) {
  currentStep = n;
  clearMatchingTimer();

  // Inject step HTML
  var content = document.getElementById('step-content');
  content.innerHTML = stepContent[n] || '<p class="text-gray-400">เนื้อหาขั้นตอนนี้ยังไม่พร้อม</p>';

  // Step-specific side effects
  if (n === 4) {
    runMatchingAnimation();
  }

  // Update nav buttons
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');

  // Steps 2, 3, 5 have a specific confirm button inside the content;
  // Step 6 (success) has two descriptive buttons inside — no footer CTA needed.
  var stepsWithInContentCTA = [2, 3, 5, 6];
  var hasInContentCTA = stepsWithInContentCTA.indexOf(n) !== -1;

  // Hide back button on step 1 (nowhere to go) and step 6 (no going back from success)
  btnPrev.style.visibility = (n === 1 || n === 6) ? 'hidden' : 'visible';

  if (hasInContentCTA) {
    btnNext.style.display = 'none';
  } else {
    btnNext.style.display = '';
    var blueBtn = 'bg-[#1967d2] hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition shadow-md';

    if (n === 4) {
      btnNext.className = 'bg-gray-200 text-gray-400 font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-not-allowed';
      btnNext.disabled = true;
      btnNext.textContent = 'กำลังค้นหา...';
      var delay = Math.floor(Math.random() * 3000) + 7000;
      matchingTimer = setTimeout(function () { matchingTimer = null; nextStep(); }, delay);
    } else {
      btnNext.className = blueBtn;
      btnNext.disabled = false;
      btnNext.innerHTML = 'ขั้นตอนถัดไป <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
      btnNext.onclick = nextStep;
    }
  }

  // Scroll modal content to top
  var modal = document.querySelector('#flexi-modal > div:not(.absolute)');
  if (modal) modal.scrollTop = 0;
}

function nextStep() {
  if (currentStep < totalSteps) renderStep(currentStep + 1);
}

function prevStep() {
  if (currentStep > 1) renderStep(currentStep - 1);
}

function goToStep(n) {
  renderStep(n);
}

// ── Step 4: matching animation ─────────────────────────────────
function runMatchingAnimation() {
  // Animate criteria appearing
  setTimeout(function () {
    var criteria = document.querySelectorAll('.matching-criteria');
    criteria.forEach(function (el, i) {
      setTimeout(function () {
        el.style.opacity = '1';
      }, i * 400);
    });
  }, 100);

  // Animate user counter
  var target = 2400;
  var counter = document.getElementById('counter-users');
  if (!counter) return;
  var duration = 1500;
  var startTime = null;
  function animateCount(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var current = Math.floor(progress * target);
    counter.textContent = current.toLocaleString('th-TH');
    if (progress < 1) requestAnimationFrame(animateCount);
  }
  requestAnimationFrame(animateCount);
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeFlexiModal();
});





const slideRightBtn = document.getElementById('slideRightBtn');
    const slideLeftBtn = document.getElementById('slideLeftBtn');
    const slider = document.getElementById('promo-slider');

    function handleButtonVisibility() {
      // 1. ตรวจสอบปุ่มซ้าย (ถ้าเลื่อนไปแล้วเกิน 10px ให้โผล่ปุ่ม)
      if (slider.scrollLeft > 10) {
        slideLeftBtn.classList.remove('hidden');
      } else {
        slideLeftBtn.classList.add('hidden');
      }

      // 2. ตรวจสอบปุ่มขวา (ถ้าเลื่อนจนสุดขอบขวาแล้ว ให้ซ่อนปุ่ม)
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 10) {
        slideRightBtn.classList.add('hidden');
      } else {
        slideRightBtn.classList.remove('hidden');
      }
    }

    slideRightBtn.addEventListener('click', () => {
      slider.scrollBy({ left: 336, behavior: 'smooth' }); 
    });

    slideLeftBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -336, behavior: 'smooth' }); 
    });

    // ดักจับการ Scroll ทุกรูปแบบ (ทั้งกดปุ่ม และเอานิ้วไถบนมือถือ)
    slider.addEventListener('scroll', handleButtonVisibility);
    
    // ดักไว้กรณีผู้ใช้กด ย่อ-ขยาย หน้าต่างเบราว์เซอร์
    window.addEventListener('resize', handleButtonVisibility);

    const fRightBtn = document.getElementById('flightRightBtn');
    const fLeftBtn = document.getElementById('flightLeftBtn');
    const fSlider = document.getElementById('flight-slider');

    function updateFlightButtons() {
      fLeftBtn.classList.toggle('hidden', fSlider.scrollLeft <= 10);
      const maxScroll = fSlider.scrollWidth - fSlider.clientWidth;
      fRightBtn.classList.toggle('hidden', fSlider.scrollLeft >= maxScroll - 10);
    }

    fRightBtn.addEventListener('click', () => fSlider.scrollBy({ left: 336, behavior: 'smooth' }));
    fLeftBtn.addEventListener('click', () => fSlider.scrollBy({ left: -336, behavior: 'smooth' }));
    fSlider.addEventListener('scroll', updateFlightButtons);
    window.addEventListener('resize', updateFlightButtons);
    updateFlightButtons();