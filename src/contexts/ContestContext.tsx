import { createContext, useContext, useState, ReactNode } from 'react';

interface CheatingFlags {
  rightClickCount: number;
  copyPasteAttempts: number;
  tabSwitches: number;
  windowBlurs: number;
  idleWarnings: number;
}

interface ContestContextType {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
  cheatingFlags: CheatingFlags;
  incrementCheatingFlag: (flag: keyof CheatingFlags) => void;
  resetContest: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export function ContestProvider({ children }: { children: ReactNode }) {
  const [htmlCode, setHtmlCode] = useState('<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Coffee Shop Website</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div id="app"></div>\n    <script src="script.js"><\/script>\n</body>\n</html>');
  const [cssCode, setCssCode] = useState('* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: #333;\n}\n\n#app {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n    padding: 20px;\n}\n\n.container {\n    background: white;\n    border-radius: 10px;\n    padding: 40px;\n    max-width: 600px;\n    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);\n}\n\nh1 {\n    color: #8B4513;\n    margin-bottom: 20px;\n}\n\np {\n    line-height: 1.6;\n    color: #555;\n}');
  const [jsCode, setJsCode] = useState('const app = document.getElementById("app");\napp.innerHTML = `\n  <div class="container">\n    <h1>Welcome to Coffee Shop</h1>\n    <p>Build this website with your own creative design!</p>\n  </div>\n`;\n\nconsole.log("JavaScript loaded successfully");');
  const [isRecording, setIsRecording] = useState(false);
  const [cheatingFlags, setCheatingFlags] = useState<CheatingFlags>({
    rightClickCount: 0,
    copyPasteAttempts: 0,
    tabSwitches: 0,
    windowBlurs: 0,
    idleWarnings: 0,
  });

  const incrementCheatingFlag = (flag: keyof CheatingFlags) => {
    setCheatingFlags(prev => ({
      ...prev,
      [flag]: prev[flag] + 1,
    }));
  };

  const resetContest = () => {
    setHtmlCode('<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Coffee Shop Website</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div id="app"></div>\n    <script src="script.js"><\/script>\n</body>\n</html>');
    setCssCode('* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: #333;\n}\n\n#app {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n    padding: 20px;\n}\n\n.container {\n    background: white;\n    border-radius: 10px;\n    padding: 40px;\n    max-width: 600px;\n    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);\n}\n\nh1 {\n    color: #8B4513;\n    margin-bottom: 20px;\n}\n\np {\n    line-height: 1.6;\n    color: #555;\n}');
    setJsCode('const app = document.getElementById("app");\napp.innerHTML = `\n  <div class="container">\n    <h1>Welcome to Coffee Shop</h1>\n    <p>Build this website with your own creative design!</p>\n  </div>\n`;\n\nconsole.log("JavaScript loaded successfully");');
    setCheatingFlags({
      rightClickCount: 0,
      copyPasteAttempts: 0,
      tabSwitches: 0,
      windowBlurs: 0,
      idleWarnings: 0,
    });
    setIsRecording(false);
  };

  return (
    <ContestContext.Provider
      value={{
        htmlCode,
        cssCode,
        jsCode,
        setHtmlCode,
        setCssCode,
        setJsCode,
        cheatingFlags,
        incrementCheatingFlag,
        resetContest,
        isRecording,
        setIsRecording,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
}

export function useContest() {
  const context = useContext(ContestContext);
  if (!context) throw new Error('useContest must be used within ContestProvider');
  return context;
}
