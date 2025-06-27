import { Injectable } from "@nestjs/common";
import { JsonCoordsDto } from "./dto/json-coords.dto";
import * as turf from "@turf/turf";
import axios from "axios";

@Injectable()
export class GeojsonService {
  constructor() {}

  async getGeojson(jsonCoordsDto: JsonCoordsDto): Promise<string> {
    try {
      const response = await axios.get(
        'https://lkmp.tvarkaulietuva.lt/lkmp-data.geojson',
        { responseType: 'json' },
      );
      const geojson = response.data;

      if (geojson.type !== 'FeatureCollection') {
        throw new Error('Invalid GeoJSON format');
      }

      const bbox = [
        jsonCoordsDto.minLong,
        jsonCoordsDto.minLat,
        jsonCoordsDto.maxLong,
        jsonCoordsDto.maxLat,
      ] as [number, number, number, number];

      const bboxPolygon = turf.bboxPolygon(bbox);

      return geojson.features.filter((feature: any) => {
        const geomType = feature.geometry?.type;
        if (geomType !== 'Polygon' && geomType !== 'MultiPolygon') return false;
        return turf.booleanIntersects(feature, bboxPolygon);
      });
    } catch (error) {
      throw new Error(`Error fetching or processing GeoJSON: ${error.message}`);
    }
  }
}
