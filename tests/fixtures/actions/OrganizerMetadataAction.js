const Action = require("../../../src/Action.js");

module.exports = class OrganizerMetadataAction extends Action {
  executed() {
    this.context.organizer = this.context.currentOrganizer();
    this.context.action = this.context.currentAction();
  }
}
