import Organizer from "../../../src/Organizer.js";

import OrganizerMetadataAction from "../actions/OrganizerMetadataAction.js";

export default class OrganizerMetadata extends Organizer {
  static call() {
    return this.with({}).reduce(OrganizerMetadataAction);
  }
}
