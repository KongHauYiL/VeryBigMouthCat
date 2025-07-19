
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Play, Download, Upload, Save } from 'lucide-react';

interface KriptasEditorProps {
  onExecute: (program: string) => void;
}

export function KriptasEditor({ onExecute }: KriptasEditorProps) {
  const [program, setProgram] = useState('');
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);

  const sampleProgram = `// Kriptas Auto-Tap Program
// This program will solve math challenges and auto-tap

CHALLENGE_SOLVE math_add(5, 3)
CHALLENGE_SOLVE crypto_hash("hello")
TAP_COUNT 10
WAIT 1000
LOOP 5 {
  TAP_EXECUTE
  WAIT 500
}`;

  const handleSave = () => {
    if (program.trim()) {
      const newPrograms = [...savedPrograms, program];
      setSavedPrograms(newPrograms);
      localStorage.setItem('kriptas-programs', JSON.stringify(newPrograms));
    }
  };

  const handleDownload = () => {
    const blob = new Blob([program], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autotap-program.krp';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setProgram(content);
      };
      reader.readAsText(file);
    }
  };

  const loadSample = () => {
    setProgram(sampleProgram);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Kriptas Auto-Tap Editor</Label>
        <div className="flex space-x-2">
          <Button onClick={loadSample} variant="outline" size="sm">
            Load Sample
          </Button>
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </span>
            </Button>
            <input
              type="file"
              accept=".krp,.txt"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Textarea
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        placeholder="Write your Kriptas program here..."
        className="min-h-[300px] font-mono text-sm bg-gray-900 text-green-400 border-gray-700"
      />

      <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
        <h4 className="font-semibold mb-2">Kriptas Language Reference:</h4>
        <ul className="space-y-1 text-xs">
          <li><code>CHALLENGE_SOLVE math_add(a, b)</code> - Solve addition challenge</li>
          <li><code>CHALLENGE_SOLVE math_multiply(a, b)</code> - Solve multiplication challenge</li>
          <li><code>CHALLENGE_SOLVE crypto_hash("text")</code> - Solve hash challenge</li>
          <li><code>TAP_COUNT n</code> - Set number of taps to execute</li>
          <li><code>TAP_EXECUTE</code> - Execute a single tap</li>
          <li><code>WAIT ms</code> - Wait for specified milliseconds</li>
          <li><code>LOOP n {{ ... }}</code> - Repeat commands n times</li>
        </ul>
      </div>

      <Button onClick={() => onExecute(program)} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Execute Program
      </Button>
    </div>
  );
}
