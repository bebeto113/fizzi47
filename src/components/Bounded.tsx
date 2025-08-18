import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType; // só pode ser "div", "a", "section" ou outro componente válido
  className?: string;     // só string, não número
  children?: React.ReactNode;  // obrigatório, e pode ser JSX, texto, etc.
}; 

export const Bounded = ({
  as: Comp = "section",
  className,
  children,
  ...restProps  //pega as props que sobraram, por exemplo: <Bounded className="bg-red-500" id="meu-container" data-test="container">, ele vai pegar o id e o data-test
}: BoundedProps) => {

  return (
    <Comp
      className={clsx("px-4 first:pt-10 md:px-6", className)}
      {...restProps}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {children}
      </div>
    </Comp>
  );
};

/* EXPLICACOES DO PORQUE USAR O BOUNDED

ele é um componente utilitário para reaproveitar layout/padding/estrutura em várias seções do site.

Garante padding horizontal consistente (px-4, md:px-6).
Garante que o conteúdo fique centralizado e com máximo de largura 7xl.
Aceita mudar a tag (as="section" | "div" | "article" | etc.).
Permite passar props extras (id, data-test, etc.).
Você não precisa repetir esse grid e padding em todas as seções do site.

O Hero só se preocupa com seu conteúdo específico (título, subheading, botão, imagens, GSAP).
O Bounded cuida do esqueleto de espaçamento e centralização. 
*/