import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceCommandsProps {
  onUpdateRevenue: (value: number) => void;
  onUpdateExpenses: (value: number) => void;
  onUpdateTeamSize: (value: number) => void;
  onUpdateBurnRate: (value: number) => void;
  currentValues: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    teamSize: number;
    burnRate: number;
  };
}

export default function VoiceCommands({
  onUpdateRevenue,
  onUpdateExpenses,
  onUpdateTeamSize,
  onUpdateBurnRate,
  currentValues
}: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setLastCommand(transcript);
        processVoiceCommand(transcript);
      };

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Command Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const processVoiceCommand = (command: string) => {
    try {
      // Parse percentage commands like "add 20% to revenue" or "increase marketing by 15%"
      const percentageMatch = command.match(/(add|increase|decrease|reduce|subtract)\s+(\d+)%?\s+(?:to|from|by)?\s*(revenue|expenses|marketing|team|burn|burn rate)/i);
      
      // Parse absolute value commands like "set revenue to 50000"
      const absoluteMatch = command.match(/(set|change)\s+(revenue|expenses|team|burn|burn rate)\s+to\s+(\d+)/i);
      
      // Parse scenario commands
      if (command.includes('worst case') || command.includes('worst-case')) {
        applyWorstCaseScenario();
        return;
      }
      
      if (command.includes('best case') || command.includes('best-case')) {
        applyBestCaseScenario();
        return;
      }

      if (percentageMatch) {
        const [, action, percentage, target] = percentageMatch;
        const percent = parseInt(percentage) / 100;
        const isIncrease = action === 'add' || action === 'increase';
        
        applyPercentageChange(target, percent, isIncrease);
      } else if (absoluteMatch) {
        const [, , target, value] = absoluteMatch;
        applyAbsoluteChange(target, parseInt(value));
      } else {
        toast({
          title: "Command Not Recognized",
          description: `I didn't understand: "${command}". Try commands like "add 20% to revenue" or "set team to 10".`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        title: "Command Processing Error",
        description: "Failed to process the voice command. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyPercentageChange = (target: string, percent: number, isIncrease: boolean) => {
    const multiplier = isIncrease ? (1 + percent) : (1 - percent);
    
    switch (target) {
      case 'revenue':
        const newRevenue = Math.round(currentValues.monthlyRevenue * multiplier);
        onUpdateRevenue(newRevenue);
        showSuccessToast(`Revenue ${isIncrease ? 'increased' : 'decreased'} by ${Math.round(percent * 100)}% to $${newRevenue.toLocaleString()}`);
        break;
      case 'expenses':
      case 'marketing':
        const newExpenses = Math.round(currentValues.monthlyExpenses * multiplier);
        onUpdateExpenses(newExpenses);
        showSuccessToast(`Expenses ${isIncrease ? 'increased' : 'decreased'} by ${Math.round(percent * 100)}% to $${newExpenses.toLocaleString()}`);
        break;
      case 'team':
        const newTeamSize = Math.max(1, Math.round(currentValues.teamSize * multiplier));
        onUpdateTeamSize(newTeamSize);
        showSuccessToast(`Team size ${isIncrease ? 'increased' : 'decreased'} by ${Math.round(percent * 100)}% to ${newTeamSize} people`);
        break;
      case 'burn':
      case 'burn rate':
        const newBurnRate = Math.round(currentValues.burnRate * multiplier);
        onUpdateBurnRate(newBurnRate);
        showSuccessToast(`Burn rate ${isIncrease ? 'increased' : 'decreased'} by ${Math.round(percent * 100)}% to $${newBurnRate.toLocaleString()}`);
        break;
    }
  };

  const applyAbsoluteChange = (target: string, value: number) => {
    switch (target) {
      case 'revenue':
        onUpdateRevenue(value);
        showSuccessToast(`Revenue set to $${value.toLocaleString()}`);
        break;
      case 'expenses':
        onUpdateExpenses(value);
        showSuccessToast(`Expenses set to $${value.toLocaleString()}`);
        break;
      case 'team':
        onUpdateTeamSize(Math.max(1, value));
        showSuccessToast(`Team size set to ${value} people`);
        break;
      case 'burn':
      case 'burn rate':
        onUpdateBurnRate(value);
        showSuccessToast(`Burn rate set to $${value.toLocaleString()}`);
        break;
    }
  };

  const applyWorstCaseScenario = () => {
    onUpdateRevenue(Math.round(currentValues.monthlyRevenue * 0.7)); // 30% decrease
    onUpdateExpenses(Math.round(currentValues.monthlyExpenses * 1.2)); // 20% increase
    onUpdateBurnRate(Math.round(currentValues.burnRate * 1.5)); // 50% increase
    showSuccessToast("Applied worst-case scenario: Revenue -30%, Expenses +20%, Burn Rate +50%");
  };

  const applyBestCaseScenario = () => {
    onUpdateRevenue(Math.round(currentValues.monthlyRevenue * 1.4)); // 40% increase
    onUpdateExpenses(Math.round(currentValues.monthlyExpenses * 0.9)); // 10% decrease
    onUpdateBurnRate(Math.round(currentValues.burnRate * 0.8)); // 20% decrease
    showSuccessToast("Applied best-case scenario: Revenue +40%, Expenses -10%, Burn Rate -20%");
  };

  const showSuccessToast = (message: string) => {
    toast({
      title: "Voice Command Applied",
      description: message,
      variant: "default"
    });
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Voice Command Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Voice commands are not supported in your browser. Please use a modern browser like Chrome or Edge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          Voice Commands
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
            data-testid="button-voice-command"
            disabled={!isSupported}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Voice Command
              </>
            )}
          </Button>
          {isListening && (
            <Badge variant="outline" className="animate-pulse">
              Listening...
            </Badge>
          )}
        </div>

        {lastCommand && (
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium">Last Command:</p>
            <p className="text-sm text-muted-foreground">"{lastCommand}"</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Example Commands:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• "Add 20% to revenue"</li>
            <li>• "Decrease expenses by 15%"</li>
            <li>• "Set team to 12"</li>
            <li>• "Reduce burn rate by 10%"</li>
            <li>• "Show me the worst case scenario"</li>
            <li>• "Apply best case scenario"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}