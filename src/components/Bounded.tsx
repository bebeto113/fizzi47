import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType; // só pode ser "div", "a", "section" ou outro componente válido
  className?: string;     // só string, não número
  children: React.ReactNode;  // obrigatório, e pode ser JSX, texto, etc.
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
