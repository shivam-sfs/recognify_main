import React, {useState} from 'react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';

interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationSearchInputProps {
    onSelect: (latLng: Coordinates) => void;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({onSelect}) => {
    const [address, setAddress] = useState<string>('');

    const handleChange = (value: string) => {
        setAddress(value);
    };

    const handleSelect = async (value: string) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        onSelect(latLng);
    };

    return (
        <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
        >
            {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                <div>
                    <input
                        {...getInputProps({
                            placeholder: 'Search Places ...',
                            className: 'location-search-input',
                        })}
                        className="form-control-alternative form-control w-100"
                    />
                    <div className="autocomplete-dropdown-container ms-2">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion: any) => (
                            <div
                                {...getSuggestionItemProps(suggestion)}
                                key={suggestion.placeId}
                                className=' px-2 mb-1 mt-1 form-control'
                            >
                                {suggestion.description}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );
};

export default LocationSearchInput;
