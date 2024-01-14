export default function isJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}
