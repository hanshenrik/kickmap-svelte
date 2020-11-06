export type Concert = {
  id: string;
  displayName: string;
  start: {
    date: Date;
  };
  popularity: any;
  venue: {
    displayName: string;
  };
  uri: string;
  location: { lat: number; lng: number };
  performance: [
    {
      displayName: string;
      artist: { id: number };
    }
  ];
};

export type Feature = {
  type: string;
  properties: {
    id: string;
    title: string;
    date: Date;
    popularity: any;
    artist: string;
    venue: string;
    imageURL: string;
    songkickURL: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
};

export type NewLocationEvent = {
  detail: {
    coordinates: [number, number];
  };
};
