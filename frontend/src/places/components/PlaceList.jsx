import "./PlaceList.css";
import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UiElement/Card";
import PlaceItem from "./PlaceItem";
const PlaceList = ({ itmes }) => {
  if (itmes.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places found</h2>
          <Button to="/places/new">Add place</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list ">
      {itmes.map((place) => (
        <PlaceItem
          key={place._id}
          id={place._id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}

        />
      ))}
    </ul>
  );
};
export default PlaceList;
