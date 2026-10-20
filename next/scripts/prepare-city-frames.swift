// Run with: swift prepare-city-frames.swift input.mp4 output.bin
// Produces a tiny RGB frame grid, not full-resolution video frames.
import Foundation
import AVFoundation
import CoreGraphics

let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let duration = try await asset.load(.duration).seconds
let columns = 56, rows = 42, fps = 12
let count = Int(duration * Double(fps))
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: 160, height: 120)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
var output = Data()
// Header: columns, rows, fps, count; four little-endian UInt32s.
for value in [columns, rows, fps, count] {
    var value = UInt32(value).littleEndian
    withUnsafeBytes(of: &value) { output.append(contentsOf: $0) }
}
for frame in 0..<count {
    let image = try await generator.image(at: CMTime(seconds: Double(frame) / Double(fps), preferredTimescale: 600)).image
    var rgba = [UInt8](repeating: 0, count: columns * rows * 4)
    rgba.withUnsafeMutableBytes { bytes in
        let context = CGContext(data: bytes.baseAddress, width: columns, height: rows, bitsPerComponent: 8, bytesPerRow: columns * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
        context.interpolationQuality = .high
        context.draw(image, in: CGRect(x: 0, y: 0, width: columns, height: rows))
    }
    for pixel in stride(from: 0, to: rgba.count, by: 4) {
        output.append(contentsOf: rgba[pixel..<pixel+3])
    }
}
try output.write(to: URL(fileURLWithPath: CommandLine.arguments[2]), options: .atomic)
print("Prepared \(count) frames, \(columns)×\(rows), \(output.count) bytes")
