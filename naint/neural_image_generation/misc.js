import { defaultMetadata } from "./defaultMetadata"

export class MetadataLoader {
    #metadata = null;

    constructor(url) {
        this.loadMetadata(url)
    }

    async loadMetadata(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }
            this.#metadata = JSON.parse(await response.text());
        }
        catch (error) {
            console.error(error);
            this.#metadata = defaultMetadata;
        }
    }

    getMetadata() {
        return this.#metadata;
    }
}

export class DevelopmentMode {

    #isActive = false;
    #mutation = null;

    constructor(reference, parentStatePropertySetter) {
        const toggler = this.createDevelopmentModeToggler(
            reference,
            parentStatePropertySetter
        )
    }

    createDevelopmentModeToggler(mutation) {
        DevelopmentPropertiesValidator.validateMutation(mutation);

        const developmentModeToggler = {
            toggle: mutation
        };

        return developmentModeToggler;
    }

    attachTogglerToWindow(reference) {
        DevelopmentPropertiesValidator.validateReference(reference);

        window[reference] = window.toggleDevelopmentMode = this.toggleDevelopmentMode
    }

    toggleDevelopmentMode() {
        this.#isActive = !this.#isActive;
        this.parentStatePropertySetter(this.#isActive);
    }

    getIsActive() {
        return this.#isActive;
    }

    getMutation() {
        return this.#mutation;
    }
}

//Just throw an Error because the developer must pass the parameters of the correct type
class DevelopmentPropertiesValidator {
    static validateReference(reference) {
        const argumentType = typeof (reference);
        if (argumentType !== "string") {
            const message = `Invalid 'reference' argument type, got ${argumentType}, 'string' expected`;
            throw new Error(message);
        }
    }

    static validateMutation(mutation) {
        const argumentType = typeof (mutation);
        if (argumentType !== "function") {
            const message = `Invalid 'mutation' argument type, got ${argumentType}, 'function' expected`;
            throw new Error(message);
        }
    }
}