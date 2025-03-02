
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Volume2, RefreshCw } from "lucide-react";
import JournalAnalysis from "./JournalAnalysis";

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  mood: string;
  entry_type: 'text' | 'voice';
  audio_url?: string;
}

interface JournalEntryListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onRefresh: () => void;
}

const JournalEntryList = ({ entries, isLoading, onRefresh }: JournalEntryListProps) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(id);
    }
  };

  const toggleAnalysis = (id: string) => {
    if (showAnalysis === id) {
      setShowAnalysis(null);
    } else {
      setShowAnalysis(id);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'mixed':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No journal entries yet</p>
        <Button variant="outline" onClick={onRefresh} className="inline-flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="sm" onClick={onRefresh} className="text-gray-500">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      {entries.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getMoodColor(entry.mood)}>
                {entry.mood || 'Neutral'}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </span>
            </div>
            {entry.entry_type === 'voice' && entry.audio_url && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => playAudio(entry.audio_url!)}
                title="Play audio recording"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          
          <CardContent>
            <p className={`text-gray-700 ${!expandedEntryId || expandedEntryId !== entry.id ? 'line-clamp-3' : ''}`}>
              {entry.content}
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(entry.id)}
              className="text-gray-500"
            >
              {expandedEntryId === entry.id ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show More
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAnalysis(entry.id)}
            >
              {showAnalysis === entry.id ? 'Hide Analysis' : 'Show Analysis'}
            </Button>
          </CardFooter>
          
          {showAnalysis === entry.id && (
            <JournalAnalysis entryId={entry.id} />
          )}
        </Card>
      ))}
    </div>
  );
};

export default JournalEntryList;
