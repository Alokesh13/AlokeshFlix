import React from "react";
import { Bookmark } from "lucide-react";

const MyList: React.FC = () => {
  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-7 h-7 text-[#e50914]" />
        <h1 className="text-white text-3xl md:text-4xl font-black">My List</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-8xl mb-6">🎬</div>
        <h2 className="text-white text-2xl font-bold mb-3">Your list is empty</h2>
        <p className="text-gray-500 max-w-md leading-relaxed">
          Add movies and TV shows to your list to watch them later. Just click
          the + button on any title to add it here.
        </p>
      </div>
    </div>
  );
};

export default MyList;
