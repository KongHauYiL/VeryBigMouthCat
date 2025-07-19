
import { useState } from 'react';
import { useGlobalTaps } from './useGlobalTaps';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  type: 'math_add' | 'math_multiply' | 'crypto_hash';
  question: string;
  answer: string | number;
}

export function useAutoTapAPI() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { handleTap } = useGlobalTaps();
  const { toast } = useToast();

  const generateChallenge = (type: Challenge['type'], params?: any[]): Challenge => {
    const id = Math.random().toString(36).substr(2, 9);
    
    switch (type) {
      case 'math_add':
        const a = params?.[0] || Math.floor(Math.random() * 100);
        const b = params?.[1] || Math.floor(Math.random() * 100);
        return {
          id,
          type,
          question: `${a} + ${b}`,
          answer: a + b
        };
      
      case 'math_multiply':
        const x = params?.[0] || Math.floor(Math.random() * 20);
        const y = params?.[1] || Math.floor(Math.random() * 20);
        return {
          id,
          type,
          question: `${x} × ${y}`,
          answer: x * y
        };
      
      case 'crypto_hash':
        const text = params?.[0] || 'challenge';
        // Simple hash simulation (not real crypto)
        const hash = text.split('').reduce((acc, char) => 
          ((acc << 5) - acc + char.charCodeAt(0)) & 0xfffff, 0
        ).toString(16);
        return {
          id,
          type,
          question: `Hash of "${text}"`,
          answer: hash
        };
      
      default:
        throw new Error(`Unknown challenge type: ${type}`);
    }
  };

  const solveChallenge = (challenge: Challenge, userAnswer: string | number): boolean => {
    return challenge.answer.toString() === userAnswer.toString();
  };

  const parseKriptasProgram = (program: string): any[] => {
    const lines = program.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('//')
    );
    
    const commands: any[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('CHALLENGE_SOLVE')) {
        const match = trimmed.match(/CHALLENGE_SOLVE\s+(\w+)\((.*?)\)/);
        if (match) {
          const [, type, params] = match;
          const paramValues = params ? params.split(',').map(p => 
            p.trim().replace(/"/g, '')
          ) : [];
          commands.push({ type: 'challenge', challengeType: type, params: paramValues });
        }
      } else if (trimmed.startsWith('TAP_COUNT')) {
        const count = parseInt(trimmed.split(' ')[1]);
        commands.push({ type: 'set_tap_count', count });
      } else if (trimmed === 'TAP_EXECUTE') {
        commands.push({ type: 'tap' });
      } else if (trimmed.startsWith('WAIT')) {
        const ms = parseInt(trimmed.split(' ')[1]);
        commands.push({ type: 'wait', ms });
      } else if (trimmed.startsWith('LOOP')) {
        const match = trimmed.match(/LOOP\s+(\d+)\s*\{/);
        if (match) {
          const iterations = parseInt(match[1]);
          commands.push({ type: 'loop_start', iterations });
        }
      } else if (trimmed === '}') {
        commands.push({ type: 'loop_end' });
      }
    }
    
    return commands;
  };

  const executeProgram = async (program: string) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    
    try {
      const commands = parseKriptasProgram(program);
      const generatedChallenges: Challenge[] = [];
      let tapCount = 1;
      
      // Process commands
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        
        switch (command.type) {
          case 'challenge':
            const challenge = generateChallenge(command.challengeType, command.params);
            generatedChallenges.push(challenge);
            
            // Show challenge to user
            const userAnswer = prompt(`Solve this challenge: ${challenge.question}`);
            if (!userAnswer || !solveChallenge(challenge, userAnswer)) {
              throw new Error(`Challenge failed: ${challenge.question}`);
            }
            
            toast({
              title: "Challenge Solved!",
              description: `Correct answer: ${challenge.answer}`,
            });
            break;
          
          case 'set_tap_count':
            tapCount = command.count;
            break;
          
          case 'tap':
            for (let j = 0; j < tapCount; j++) {
              await handleTap();
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            break;
          
          case 'wait':
            await new Promise(resolve => setTimeout(resolve, command.ms));
            break;
          
          case 'loop_start':
            // Simple loop implementation
            for (let iteration = 0; iteration < command.iterations; iteration++) {
              let loopEnd = false;
              let j = i + 1;
              
              while (j < commands.length && !loopEnd) {
                const loopCommand = commands[j];
                
                if (loopCommand.type === 'loop_end') {
                  loopEnd = true;
                } else if (loopCommand.type === 'tap') {
                  await handleTap();
                  await new Promise(resolve => setTimeout(resolve, 100));
                } else if (loopCommand.type === 'wait') {
                  await new Promise(resolve => setTimeout(resolve, loopCommand.ms));
                }
                
                j++;
              }
            }
            
            // Skip to end of loop
            while (i < commands.length && commands[i].type !== 'loop_end') {
              i++;
            }
            break;
        }
      }
      
      setChallenges(generatedChallenges);
      
      toast({
        title: "Program Executed Successfully!",
        description: `Completed ${generatedChallenges.length} challenges`,
      });
      
    } catch (error) {
      toast({
        title: "Program Execution Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executeProgram,
    isExecuting,
    challenges,
    generateChallenge,
    solveChallenge,
  };
}
