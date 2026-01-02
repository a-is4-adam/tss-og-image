import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";

const getCharacter = createServerFn({
  method: "GET",
})
  .inputValidator((input: { id: string }) => {
    if (!input.id) {
      throw new Error("No id provided");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/${data.id}`
    );
    const character = (await res.json()) as {
      id: string;
      name: string;
      image: string;
    };
    return character;
  });

const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return { userId: null };
  }

  return { userId };
});

export const Route = createFileRoute("/characters/$id")({
  beforeLoad: async () => await authStateFn(),
  loader: ({ params }) => getCharacter({ data: { id: params.id } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.name || "Character" },
      {
        name: "description",
        content: `Details for character ${loaderData?.name}`,
      },
      // Open Graph
      { property: "og:title", content: loaderData?.name },
      {
        property: "og:description",
        content: `ID: ${loaderData?.id}`,
      },
      { property: "og:image", content: loaderData?.image },
      { property: "og:type", content: "website" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: loaderData?.name },
      {
        name: "twitter:description",
        content: `ID: ${loaderData?.id}`,
      },
      { name: "twitter:image", content: loaderData?.image },
    ],
  }),
  component: CharacterComponent,
});

function CharacterComponent() {
  const ctx = Route.useRouteContext();
  const character = Route.useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      {ctx.userId ? <p>Logged in as {ctx.userId}</p> : <p>Not logged in</p>}
      <h1>{character.name}</h1>
      <p>ID: {character.id}</p>
      <img
        src={character.image}
        alt={character.name}
        style={{ maxWidth: "300px", borderRadius: "8px" }}
      />
    </div>
  );
}
