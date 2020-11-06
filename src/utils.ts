/**
 *
 * @param id
 * @returns is the element with the given id currently present on the screen
 */
export const isElementOnScreen = (id: string): boolean => {
  const distanceToTopForActiveConcertInfo = 200;
  const element = document.getElementById(id);
  const bounds = element.getBoundingClientRect();
  return (
    bounds.top < window.innerHeight &&
    bounds.bottom > distanceToTopForActiveConcertInfo
  );
};

/**
 *
 * @param min
 * @param max
 * @returns a random number between min (inclusive) and max (exclusive)
 */
export const getRandomNumber = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

/**
 *
 * @returns the correct API URL given the environment
 */
export const createApiUrl = (devMode: boolean, path: string): string =>
  `${devMode ? "http://localhost:3000" : ""}${path}`;
