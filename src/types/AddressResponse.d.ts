export interface AddressResponse {
  result: Result[];
  code: number;
  message: string;
  limit: number;
  page: number;
  total: number;
}

export interface Result {
  postcode: string;
  postcode_inward: string;
  postcode_outward: string;
  post_town: string;
  dependant_locality: string;
  double_dependant_locality: string;
  thoroughfare: string;
  dependant_thoroughfare: string;
  building_number: string;
  building_name: string;
  sub_building_name: string;
  po_box: string;
  department_name: string;
  organisation_name: string;
  udprn: number;
  postcode_type: string;
  su_organisation_indicator: string;
  delivery_point_suffix: string;
  line_1: string;
  line_2: string;
  line_3: string;
  premise: string;
  longitude: number;
  latitude: number;
  eastings: number;
  northings: number;
  country: string;
  traditional_county: string;
  administrative_county: string;
  postal_county: string;
  county: string;
  district: string;
  ward: string;
  uprn: string;
  id: string;
  country_iso: string;
  country_iso_2: string;
  county_code: string;
  language: string;
  umprn: string;
  dataset: string;
}
