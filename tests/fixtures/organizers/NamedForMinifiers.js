const Organizer = require("../../../src/Organizer.js");
const OrganizerMetadataAction = require("../actions/OrganizerMetadataAction.js");

// `displayName` is what survives a minifier renaming the class.
module.exports = class NamedForMinifiers extends Organizer {
  static displayName = "MyOrganizer";

  static call() {
    return this.with({}).reduce(OrganizerMetadataAction);
  }
};
