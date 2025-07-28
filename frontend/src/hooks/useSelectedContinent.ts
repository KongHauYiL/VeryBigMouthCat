
import { useLocalStorage } from './useLocalStorage';

interface SelectedContinent {
  code: string;
  name: string;
  flag: string;
}

export function useSelectedContinent() {
  const [selectedContinent, setSelectedContinent] = useLocalStorage<SelectedContinent | null>(
    'selectedContinent',
    null
  );

  const hasSelectedContinent = selectedContinent !== null;

  const selectContinent = (continent: SelectedContinent) => {
    setSelectedContinent(continent);
  };

  const clearSelection = () => {
    setSelectedContinent(null);
  };

  return {
    selectedContinent,
    hasSelectedContinent,
    selectContinent,
    clearSelection,
  };
}
