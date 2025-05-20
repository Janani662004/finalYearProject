declare module 'react-native-audio-recorder-player' {
    export interface AudioRecorderPlayer {
      startRecorder: (path: string) => Promise<void>;
      stopRecorder: () => Promise<string>;
      startPlayer: (path: string) => Promise<void>;
      stopPlayer: () => Promise<void>;
      pausePlayer: () => Promise<void>;
      resumePlayer: () => Promise<void>;
      getDuration: (path: string) => Promise<number>;
      getCurrentPosition: (path: string) => Promise<number>;
    }
  
    const AudioRecorderPlayer: AudioRecorderPlayer;
  
    export default AudioRecorderPlayer;
  }
  