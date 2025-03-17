import ding from '../../assets/ding.mp3'

// Create audio element with notification sound
const notificationSound = new Audio(ding);  // You'll need to add this MP3 file to your public folder
notificationSound.volume = 0.5; // Set volume to 50%

export const playMessageSound = () => {
  try {
    notificationSound.currentTime = 0; // Reset to start
    const playPromise = notificationSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Sound play failed:", error);
      });
    }
  } catch (err) {
    console.log("Error playing sound:", err);
  }
}; 