
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Continent {
  code: string;
  name: string;
  flag: string;
}

const continents: Continent[] = [
  { code: 'NA', name: 'North America', flag: '🌎' },
  { code: 'SA', name: 'South America', flag: '🌎' },
  { code: 'EU', name: 'Europe', flag: '🌍' },
  { code: 'AS', name: 'Asia', flag: '🌏' },
  { code: 'AF', name: 'Africa', flag: '🌍' },
  { code: 'OC', name: 'Oceania', flag: '🌏' },
  { code: 'AN', name: 'Antarctica', flag: '🐧' },
];

interface ContinentSelectionModalProps {
  isOpen: boolean;
  onSelectContinent: (continent: Continent) => void;
}

export const ContinentSelectionModal: React.FC<ContinentSelectionModalProps> = ({
  isOpen,
  onSelectContinent,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl">
            Select Your Continent
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-gray-300 text-center text-sm">
            Choose your continent to help us track global taps more accurately!
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {continents.map((continent) => (
              <Button
                key={continent.code}
                onClick={() => onSelectContinent(continent)}
                variant="outline"
                className="w-full justify-start h-12 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white"
              >
                <span className="text-2xl mr-3">{continent.flag}</span>
                <span className="text-base">{continent.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
