document.addEventListener("DOMContentLoaded", () => {
  const audioElement = document.getElementById("audioFeed");
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const recordingIndicator = document.getElementById("recordingIndicator");
  const recordingsList = document.getElementById("recordingsList");

  let mediaRecorder;
  let chunks = [];
  const recordings = [];

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audeoBlod = new Blob(chunks, { type: "audio.ogg; codecs=opus" });
        const audioUrl = URL.createObjectURL(audeoBlod);
        chunks = [];
        const recording = { url: audioUrl, blob: audeoBlod };
        recordings.push(recording);

        displayRecordiong(); ///!!!!!!

        startButton.disabled = false;
        stopButton.disabled = true;
        recordingIndicator.style.display = "none";
      };

      mediaRecorder.start();
      startButton.disabled = true;
      stopButton.disabled = false;
      recordingIndicator.style.display = "inline";
    } catch (error) {
      console.error("Помилка доступу до аудіо", error);
      alert("Не вдалося отримати доступ до мікрафону. Перевірте налаштування.");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }

  function displayRecordiong() {
    recordingsList.innerHTML = "";

    recordings.forEach((recording, index) => {
      const recordingItem = document.createElement("li");
      recordingItem.classList.add("recording-item");

      const recordingName = document.createElement("span");
      recordingName.classList.add("recording-name");
      recordingName.textContent = `Запис ${index + 1}`;

      const recordingActions = document.createElement("div");
      recordingActions.classList.add("recording-actions");

      const playButton = document.createElement("button");
      playButton.textContent = "Відтворити";
      playButton.classList.add("btn");
      playButton.classList.add("play");
      playButton.addEventListener("click", () => {
        audioElement.src = recording.url;
        audioElement.play();
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Widalyty";
      deleteButton.classList.add("btn");
      deleteButton.classList.add("delete");
      deleteButton.addEventListener("click", () => {
        recordings.splice(index, 1);
        displayRecordiong();
      });

      const downloadButton = document.createElement("button");
      downloadButton.textContent = "Завантажити";
      downloadButton.classList.add("btn");
      downloadButton.classList.add("download");
      downloadButton.addEventListener("click", () => {
        const downloadLink = document.createElement("a");
        downloadLink.href = recording.url;
        downloadLink.download = `recorded_audio_${index + 1}.ogg`;
        downloadLink.click();
      });

      recordingActions.appendChild(playButton);
      recordingActions.appendChild(downloadButton);
      recordingActions.appendChild(deleteButton);

      recordingItem.appendChild(recordingName);
      recordingItem.appendChild(recordingActions);

      recordingsList.appendChild(recordingItem);
    });
  }

  startButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);
});
