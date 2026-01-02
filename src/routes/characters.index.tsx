import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getCharacters = createServerFn({
  method: "GET",
}).handler(async () => {
  const res = await fetch("https://rickandmortyapi.com/api/character");
  const data = await res.json();
  return data.results;
});

export const Route = createFileRoute("/characters/")({
  loader: () => getCharacters(),
  component: CharactersComponent,
});

function CharactersComponent() {
  const characters = Route.useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Characters</h1>
      <ul>
        {characters.map((character: any) => (
          <li key={character.id}>
            <Link to="/characters/$id" params={{ id: character.id.toString() }}>
              {character.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
