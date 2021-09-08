const Organizer = require("../../../src/Organizer.js");
const OrganizerMetadataAction = require("../actions/OrganizerMetadataAction.js");

module.exports = class OrganizerMetadata extends Organizer {
  static call() {
    return this.with({}).reduce(OrganizerMetadataAction);
  }
}
