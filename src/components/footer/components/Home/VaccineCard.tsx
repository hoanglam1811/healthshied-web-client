import { Link } from "react-router-dom";

const VaccineCard = (vaccine: any) => {

  return (
    <Link to={`/vaccine/${vaccine?.id}`}>
      <div className="relative flex flex-col items-center bg-white gap-2 p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
        <div className="relative">
          <img
            src={vaccine?.imageUrl}
            alt={vaccine?.name}
            className="w-50 h-50 object-contain rounded"
          />
        </div>

        {/* Product Details */}
        <div className="text-left">
          <h3
            className="text-md font-bold text-gray-800"
          >
            {vaccine?.name?.length > 40
              ? vaccine?.name.substring(0, 40) + "..."
              : vaccine?.name}
          </h3>

          <div className="flex items-center justify-start gap-2">
            <p className="text-sm text-gray-500 line-through">
              {vaccine?.price?.toLocaleString("en-US")}đ
            </p>
          </div>

        </div>
      </div>

    </Link>
  );
};

export default VaccineCard;
