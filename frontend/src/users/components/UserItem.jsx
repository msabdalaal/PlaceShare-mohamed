import { Link } from "react-router-dom";
import Card from "../../shared/components/UiElement/Card";
import Avatar from "../../shared/components/UiElement/Avatar";
import "./UserItem.css";
const UserItem = ({ id, image, name, placeCount }) => {
  return (
    <li key={id} className="user-item ">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};
export default UserItem;
