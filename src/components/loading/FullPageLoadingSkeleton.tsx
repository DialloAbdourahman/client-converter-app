type Props = {
  items: number;
};

const FullPageLoadingSkeleton = ({ items }: Props) => {
  const things = Array.from({ length: items }, (_, i) => i);

  return (
    <section className=" h-full p-5 animate-pulse">
      <div className=" mt-2">
        {things.map((thing) => {
          return (
            <div key={thing} className=" flex justify-between gap-3 mb-2">
              <div className="bg-gray-300 w-[20%]"></div>
              <div className=" w-[80%]">
                <div className="bg-gray-300 py-3 mb-1"></div>
                <div className="bg-gray-300 py-3 mb-1"></div>
                <div className="bg-gray-300 py-3 mb-1"></div>
                <div className="bg-gray-300 py-3 mb-1"></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FullPageLoadingSkeleton;
