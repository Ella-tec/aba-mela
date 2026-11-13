using System.Security.Cryptography;
using System.Text;

namespace AbaMela.Api.Security;

public static class Totp
{
    private const string Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    public static string CreateSecret()
    {
        var bytes = RandomNumberGenerator.GetBytes(20);
        return Base32Encode(bytes);
    }

    public static string ProvisioningUri(string secret, string email)
    {
        var label = Uri.EscapeDataString("Mela:" + email);
        var issuer = Uri.EscapeDataString("Mela");
        return $"otpauth://totp/{label}?secret={secret}&issuer={issuer}&digits=6&period=30&algorithm=SHA1";
    }

    public static bool Verify(string secret, string? code)
    {
        if (string.IsNullOrWhiteSpace(code) || code.Length != 6 || !code.All(char.IsDigit))
            return false;
        byte[] key;
        try { key = Base32Decode(secret); }
        catch { return false; }

        var counter = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 30;
        for (var offset = -1; offset <= 1; offset++)
        {
            var data = BitConverter.GetBytes(System.Net.IPAddress.HostToNetworkOrder(counter + offset));
            var hash = HMACSHA1.HashData(key, data);
            var index = hash[^1] & 0x0f;
            var binary = ((hash[index] & 0x7f) << 24) | ((hash[index + 1] & 0xff) << 16)
                | ((hash[index + 2] & 0xff) << 8) | (hash[index + 3] & 0xff);
            var expected = (binary % 1_000_000).ToString("D6");
            if (CryptographicOperations.FixedTimeEquals(Encoding.ASCII.GetBytes(expected), Encoding.ASCII.GetBytes(code)))
                return true;
        }
        return false;
    }

    private static string Base32Encode(byte[] data)
    {
        var output = new StringBuilder();
        var buffer = 0;
        var bitsLeft = 0;
        foreach (var value in data)
        {
            buffer = (buffer << 8) | value;
            bitsLeft += 8;
            while (bitsLeft >= 5)
            {
                output.Append(Alphabet[(buffer >> (bitsLeft - 5)) & 31]);
                bitsLeft -= 5;
            }
        }
        if (bitsLeft > 0) output.Append(Alphabet[(buffer << (5 - bitsLeft)) & 31]);
        return output.ToString();
    }

    private static byte[] Base32Decode(string value)
    {
        var output = new List<byte>();
        var buffer = 0;
        var bitsLeft = 0;
        foreach (var character in value.TrimEnd('=').ToUpperInvariant())
        {
            var index = Alphabet.IndexOf(character);
            if (index < 0) throw new FormatException("Invalid Base32 secret.");
            buffer = (buffer << 5) | index;
            bitsLeft += 5;
            if (bitsLeft >= 8)
            {
                output.Add((byte)((buffer >> (bitsLeft - 8)) & 255));
                bitsLeft -= 8;
            }
        }
        return output.ToArray();
    }
}
