describe("Auth logic tests", () => {

    // Erregistro datuak

    test("Izenik gabe erregistroa ez da baliozkoa", () => {
        const body = {
            lastName: "Ucin",
            email: "test@test.com",
            password: "123456"
        };

        const isValid =
            body.name &&
            body.lastName &&
            body.email &&
            body.password;

        expect(isValid).toBeFalsy();
    });

    test("Abizenik gabe erregistroa ez da baliozkoa", () => {
        const body = {
            name: "Xabier",
            email: "test@test.com",
            password: "123456"
        };

        const isValid =
            body.name &&
            body.lastName &&
            body.email &&
            body.password;

        expect(isValid).toBeFalsy();
    });

    test("Korreorik gabe erregistroa ez da baliozkoa", () => {
        const body = {
            name: "Xabier",
            lastName: "Ucin",
            password: "123456"
        };

        const isValid =
            body.name &&
            body.lastName &&
            body.email &&
            body.password;

        expect(isValid).toBeFalsy();
    });

    test("Datu guztiak badaude erregistroa baliozkoa da", () => {
        const body = {
            name: "Xabier",
            lastName: "Ucin",
            email: "xabier@uni.eus",
            password: "123456"
        };

        const isValid =
            body.name &&
            body.lastName &&
            body.email &&
            body.password;

        expect(isValid).toBeTruthy();
    });

    // Pasahitzaren logika

    test("Pasahitz hutsa ez da baliozkoa", () => {
        const password = "";

        const isValidPassword = password && password.length >= 6;

        expect(isValidPassword).toBeFalsy();
    });

    test("Pasahitz laburra (<6) ez da baliozkoa", () => {
        const password = "123";

        const isValidPassword = password && password.length >= 6;

        expect(isValidPassword).toBeFalsy();
    });

    test("Pasahitz egokia (>=6) baliozkoa da", () => {
        const password = "123456";

        const isValidPassword = password && password.length >= 6;

        expect(isValidPassword).toBeTruthy();
    });

    test("Pasahitzak zuriuneak hasieran edo amaieran baditu trim ondoren baliozkoa da", () => {
        const password = "   123456   ";

        const trimmedPassword = password.trim();
        const isValidPassword = trimmedPassword.length >= 6;

        expect(isValidPassword).toBeTruthy();
    });

    // Emailaren regex logika

    const emailRegex = /^\S+@\S+\.\S+$/;

    test("Email hutsa ez da baliozkoa", () => {
        const email = "";

        const isValidEmail = emailRegex.test(email);

        expect(isValidEmail).toBe(false);
    });

    test("Emailak espazioak baditu ez da baliozkoa", () => {
        const email = "test @test.com";

        const isValidEmail = emailRegex.test(email);

        expect(isValidEmail).toBe(false);
    });

    test("Emailak @ ez badu ez da baliozkoa", () => {
        const email = "testtest.com";

        const isValidEmail = emailRegex.test(email);

        expect(isValidEmail).toBe(false);
    });

    test("Emailak . ez badu ez da baliozkoa", () => {
        const email = "test@testcom";

        const isValidEmail = emailRegex.test(email);

        expect(isValidEmail).toBe(false);
    });

    test("Email formatu egokia baliozkoa da", () => {
        const email = "test@test.com";

        const isValidEmail = emailRegex.test(email);

        expect(isValidEmail).toBe(true);
    });

    test("Emailak zuriuneak kanpoan baditu trim ondoren baliozkoa da", () => {
        const email = "   test@test.com   ";

        const trimmedEmail = email.trim();
        const isValidEmail = emailRegex.test(trimmedEmail);

        expect(isValidEmail).toBe(true);
    });

});
