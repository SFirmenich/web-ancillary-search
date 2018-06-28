class TypeAndWaitBasedTrigger extends TriggerMechanism {
  loadParamsConfigControls() {
    this.client.addParamsConfigurationControls(document.createTextNode("TypeAndWaitBasedTrigger"));
  }

  getProperties() {
    return {
      className: this.constructor.name,
    };
  }

  loadSubformBehaviour() {
    this.client.showAllHiddenElements();
  }

  areRequirementsMet() {
    return true;
  }

  onTriggerSelection(data) {
    this.client.showAllHiddenElements();
    this.removeErrorMessage();
  }
}
