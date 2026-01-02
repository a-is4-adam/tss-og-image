import { createFileRoute } from "@tanstack/react-router";
// import satori from "satori";
// import { initWasm, Resvg } from "@resvg/resvg-wasm";
// let wasmInitialized: Promise<void> | null = null;
import ImageResponse from "@takumi-rs/image-response";
import type { ReactNode } from "react";
import { Axe } from "lucide-react";
// function initializeWasm() {
//   if (!wasmInitialized) {
//     wasmInitialized = initWasm(
//       fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm")
//     );
//   }
//   return wasmInitialized;
// }

const getCharacterRaw = async (id: string) => {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  return (await res.json()) as {
    id: number;
    name: string;
    image: string;
  };
};

export const Route = createFileRoute("/characters/$id/og")({
  // server: {
  //   handlers: {
  //     GET: async ({ request, params }) => {
  //       const url = new URL(request.url);
  //       const character = await getCharacterRaw(params.id);

  //       const svg = await satori(
  //         <div
  //           style={{
  //             height: "100%",
  //             width: "100%",
  //             display: "flex",
  //             flexDirection: "row",
  //             alignItems: "center",
  //             justifyContent: "flex-start",
  //             backgroundColor: "#111",
  //             backgroundImage: "linear-gradient(135deg, #111 0%, #222 100%)",
  //             color: "#fff",
  //             padding: "60px",
  //             fontFamily: "Inter",
  //           }}
  //         >
  //           <div
  //             style={{
  //               display: "flex",
  //               boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  //               borderRadius: "32px",
  //               overflow: "hidden",
  //               border: "4px solid rgba(255,255,255,0.1)",
  //               marginRight: "60px",
  //             }}
  //           >
  //             <img
  //               src={character.image}
  //               style={{
  //                 width: "450px",
  //                 height: "450px",
  //                 objectFit: "cover",
  //               }}
  //             />
  //           </div>
  //           <div
  //             style={{
  //               display: "flex",
  //               flexDirection: "column",
  //               flex: 1,
  //             }}
  //           >
  //             <div
  //               style={{
  //                 fontSize: 28,
  //                 fontWeight: 500,
  //                 color: "#3b82f6",
  //                 marginBottom: 16,
  //                 textTransform: "uppercase",
  //                 letterSpacing: "0.1em",
  //               }}
  //             >
  //               Rick and Morty Character
  //             </div>
  //             <div
  //               style={{
  //                 fontSize: 84,
  //                 fontWeight: 800,
  //                 lineHeight: 1.1,
  //                 marginBottom: 24,
  //               }}
  //             >
  //               {character.name}
  //             </div>
  //             <div
  //               style={{
  //                 fontSize: 32,
  //                 color: "#94a3b8",
  //                 display: "flex",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <span style={{ marginRight: 12 }}>ID:</span>
  //               <span style={{ color: "#fff" }}>{character.id}</span>
  //             </div>
  //           </div>
  //         </div>,

  //         {
  //           width: 1200,
  //           height: 630,
  //           fonts: [
  //             {
  //               name: "Inter",
  //               data: regularFontData,
  //               weight: 400,
  //               style: "normal",
  //             },
  //             {
  //               name: "Inter",
  //               data: mediumFontData,
  //               weight: 500,
  //               style: "normal",
  //             },
  //             {
  //               name: "Inter",
  //               data: boldFontData,
  //               weight: 700,
  //               style: "normal",
  //             },
  //             {
  //               name: "Inter",
  //               data: extraBoldFontData,
  //               weight: 800,
  //               style: "normal",
  //             },
  //           ],
  //         }
  //       );

  //       await initializeWasm();

  //       const resvg = new Resvg(svg, {
  //         fitTo: { mode: "width", value: 1200 },
  //       });
  //       const pngData = resvg.render();
  //       const pngBuffer = pngData.asPng();

  //       return new Response(pngBuffer as any, {
  //         headers: {
  //           "Content-Type": "image/png",
  //           "Cache-Control": "public, max-age=31536000, immutable",
  //         },
  //       });
  //     },
  //   },
  // },
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { host } = new URL(request.url);
        // const url = new URL(request.url);
        const character = await getCharacterRaw(params.id);
        const image = await fetch(character.image).then((res) =>
          res.arrayBuffer()
        );
        if (!image) {
          return new Response("Image not found", { status: 404 });
        }

        return new ImageResponse(
          <DocsTemplate
            title={`Hello from ${host}!`}
            description="If you see this, the TanStack Start example works."
            icon={<Axe color="hsl(354, 90%, 60%)" size={64} />}
            primaryColor="hsla(354, 90%, 54%, 0.3)"
            primaryTextColor="hsl(354, 90%, 60%)"
            site="Takumi"
            character={character}
          />,
          {
            width: 1200,
            height: 630,
            format: "webp",
            persistentImages: [
              {
                src: "image",
                data: image,
              },
            ],
          }
        );
      },
    },
  },
});

export default function DocsTemplate({
  title,
  description,
  icon,
  primaryColor,
  primaryTextColor,
  site,
  character,
}: {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  primaryColor: string;
  primaryTextColor: string;
  site: ReactNode;
  character: {
    id: number;
    name: string;
    image: string;
  };
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#050505",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: "white",
        backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, transparent)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "60px",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginBottom: "40px",
            textWrap: "pretty",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "white",
            }}
          >
            {character.name}
          </span>
          <span
            style={{
              fontSize: 44,
              color: "#a1a1aa",
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: "95%",
              letterSpacing: "-0.01em",
              lineClamp: 2,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {character.id}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          {icon}
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "white",
              opacity: 0.9,
            }}
          >
            <img src="image" alt={character.name} />
            {site}
          </span>
          <div style={{ flexGrow: 1 }} />
          <div
            style={{
              height: 4,
              width: 60,
              backgroundColor: primaryColor,
              borderRadius: 2,
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: primaryTextColor,
              opacity: 0.8,
            }}
          >
            Documentation
          </span>
        </div>
      </div>
    </div>
  );
}
