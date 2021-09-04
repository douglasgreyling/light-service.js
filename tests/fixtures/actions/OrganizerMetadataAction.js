import Action from "../../../src/Action.js";

export default class OrganizerMetadataAction extends Action {
  executed() {
    this.context.organizer = this.context.currentOrganizer();
    this.context.action = this.context.currentAction();
  }
}
