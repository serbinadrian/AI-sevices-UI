export class DevelopmentMode {
    #isActive = false;

    constructor(parentStatePropertySetter) {
        this.parentStatePropertySetter = parentStatePropertySetter;
        window.toggleDevelopmentMode = this.toggleDevelopmentMode;
    }

    toggleDevelopmentMode() {
        this.#isActive = !this.#isActive;
        this.parentStatePropertySetter(this.#isActive);
    }

    getIsActive() {
        return this.#isActive;
    }
}