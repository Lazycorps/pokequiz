export class PokemonTypeDTO {
  id = 0;
  name = "";
  damage_relations!: DamageRelations;
  game_indices!: GameIndex[];
  generation!: Link;
  move_damage_class!: Link;
  names!: Names[];
  pokemon!: Pokemon[];
  moves!: Link[];
}

export class PokemonType extends PokemonTypeDTO {
  constructor(data?: PokemonTypeDTO) {
    super();
    Object.assign(this, data || new PokemonTypeDTO());
  }

  get frName() {
    return (
      this.names?.filter((n) => n.language.name == "fr")[0].name ?? this.name
    );
  }
}

interface Pokemon {
  slot: number;
  pokemon: Link;
}

interface Names {
  name: string;
  language: Link;
}

interface GameIndex {
  game_index: number;
  generation: Link;
}

interface DamageRelations {
  no_damage_to: Link[];
  half_damage_to: Link[];
  double_damage_to: Link[];
  no_damage_from: Link[];
  half_damage_from: Link[];
  double_damage_from: Link[];
}

export interface Link {
  name: string;
  url: string;
}
