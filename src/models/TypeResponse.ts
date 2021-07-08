import { PokemonType } from "./PokemonType";

export class TypeResponse {
  score = 0;
  elapsedTime = 0;
  response = "";
  goodResponse = "";
  currentType = new PokemonType();
  currentTypeImg = "";
  versusType: PokemonType = new PokemonType();
  versusTypeImg = "";
}
