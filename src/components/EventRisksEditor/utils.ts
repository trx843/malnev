import { MssEventType } from "../../classes";

type key = 'eventGroupId' |  'eventSubGroupId' |'id'

const filterKeyTypes: key[] = ['eventGroupId', 'eventSubGroupId', 'id']

export const returnFilteredMssEventTypes = (types: MssEventType[], treeKey: string): MssEventType[] => {
  if(!types || !treeKey) return []
  const keys = treeKey.split('-');
  const filterIndex = keys.length - 1;
  const filterKey = filterKeyTypes[filterIndex];

  const filteredEvents = types.filter(type => type[filterKey].toString() === keys[filterIndex]);

  return filteredEvents;
} 