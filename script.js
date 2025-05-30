document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  document.getElementById("start-btn").addEventListener("click", () => {
      // Ẩn màn hình bắt đầu
      document.querySelector("#s").style.display = "none";

      // Hiện phần nội dung chính
      document.getElementById("main-content").classList.remove("hidden");

      // Phát nhạc nền
      const music = document.getElementById("bg-music");
      music.play().catch(err => console.log("Autoplay failed:", err));
});

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

 function isBlowing() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  let average = sum / bufferLength;

  return average > 60; // Tăng ngưỡng để giảm độ nhạy
}

function blowOutCandles() {
  let blownOut = 0;

  if (isBlowing()) {
    candles.forEach((candle) => {
      if (!candle.classList.contains("out") && Math.random() > 0.5) {
        candle.classList.add("out");
        blownOut++;
      }
    });

    if (blownOut > 0) {
      updateCandleCount();
    }

    // Kiểm tra nếu tất cả các nến đều đã bị tắt
    const allOut = [...candles].every(candle => candle.classList.contains("out"));
    if (allOut && blownOut > 0) {
      const bdc = document.querySelector(".birthday-card");
      bdc.classList.remove("hidden");
    }
  }
}


  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});
