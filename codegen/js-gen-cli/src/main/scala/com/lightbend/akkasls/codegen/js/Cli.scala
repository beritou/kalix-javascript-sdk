/*
 * Copyright (c) Lightbend Inc. 2021
 *
 */

package com.lightbend.akkasls.codegen
package js

import scopt.OParser
import java.io.File
import java.nio.file.{ Path, Paths }
import js.{ SourceGenerator => JavaScriptGenerator }
import ts.{ SourceGenerator => TypeScriptGenerator }

object Cli {

  private final val CWD = Paths.get(".")

  sealed trait Language
  final case object TypeScript extends Language
  final case object JavaScript extends Language

  @SuppressWarnings(Array("org.wartremover.warts.DefaultArguments"))
  private case class Config(
      baseDir: Path = CWD,
      indexFile: String = "index.ts",
      descriptorSetOutputDirectory: Path = CWD,
      descriptorSetFileName: String = "user-function.desc",
      protoSourceDirectory: Path = CWD,
      serviceNamesFilter: String = ".*ServiceEntity",
      sourceDirectory: Path = CWD,
      testSourceDirectory: Path = CWD,
      generatedSourceDirectory: Path = CWD,
      integrationTestSourceDirectory: Option[Path] = None,
      language: Language = TypeScript
  )

  private val builder = OParser.builder[Config]
  private val parser = {
    import builder._
    OParser.sequence(
      programName("akkasls-codegen-js"),
      head("akkasls-codegen-js", BuildInfo.version),
      opt[File]("base-dir")
        .action((x, c) => c.copy(baseDir = x.toPath))
        .text(
          "The base directory for the project as a parent to the source files - defaults to the current working directory"
        ),
      opt[String]("main-file")
        .action((x, c) => c.copy(indexFile = x))
        .text(
          "The name of the file to be used to set up entities, relative to the source directory - defaults to index.ts"
        ),
      opt[File]("descriptor-set-output-dir")
        .action((x, c) => c.copy(descriptorSetOutputDirectory = x.toPath))
        .text(
          "The location of the descriptor output file generated by protoc - defaults to the current working directory"
        ),
      opt[String]("descriptor-set-file")
        .action((x, c) => c.copy(descriptorSetFileName = x))
        .text(
          "The name of the descriptor output file generated by protoc - defaults to user-function.desc"
        ),
      opt[File]("proto-source-dir")
        .action((x, c) => c.copy(protoSourceDirectory = x.toPath))
        .text(
          "The location of protobuf source files in relation to the base directory - defaults to the current working directory"
        ),
      opt[String]("service-names-filter")
        .action((x, c) => c.copy(serviceNamesFilter = x))
        .text(
          "The regex pattern used to discern entities from service declarations - defaults to .*ServiceEntity"
        ),
      opt[File]("source-dir")
        .action((x, c) => c.copy(sourceDirectory = x.toPath))
        .text(
          "The location of source files in relation to the base directory - defaults to the current working directory"
        ),
      opt[File]("generated-source-dir")
        .action((x, c) => c.copy(generatedSourceDirectory = x.toPath))
        .text(
          "The location of generated source files in relation to the base directory - defaults to the current working directory"
        ),
      opt[File]("test-source-dir")
        .action((x, c) => c.copy(testSourceDirectory = x.toPath))
        .text(
          "The location of test source files in relation to the base directory - defaults to the current working directory"
        ),
      opt[File]("integration-test-source-dir")
        .action((x, c) => c.copy(integrationTestSourceDirectory = Some(x.toPath)))
        .text(
          "The location of integration test source files in relation to the base directory - defaults to the current working directory"
        ),
      opt[String]("language")
        .action((x, c) =>
          c.copy(language =
            if ("js".equalsIgnoreCase(x) || "javascript".equalsIgnoreCase(x)) JavaScript
            else TypeScript
          )
        )
        .text(
          "Either js or ts - defaults to ts (TypeScript)"
        ),
      help("help").text("Prints this usage text")
    )
  }

  def main(args: Array[String]): Unit =
    OParser.parse(parser, args, Config()) match {
      case Some(config) =>
        val protobufDescriptor =
          config.descriptorSetOutputDirectory.resolve(config.descriptorSetFileName).toFile
        if (protobufDescriptor.exists) {
          println("Inspecting proto file descriptor for entity generation...")
          val _ = DescriptorSet.fileDescriptors(protobufDescriptor) match {
            case Right(fileDescriptors) =>
              val model =
                ModelBuilder.introspectProtobufClasses(
                  fileDescriptors.map {
                    case Right(fileDescriptor) => fileDescriptor
                    case Left(e) =>
                      System.err.println(
                        "There was a problem building the file descriptor from its protobuf:"
                      )
                      System.err.println(e.toString)
                      sys.exit(1)
                  }
                )

              val absBaseDir = config.baseDir.toAbsolutePath
              val generated = config.language match {
                case JavaScript =>
                  JavaScriptGenerator
                    .generate(
                      protobufDescriptor.toPath,
                      model,
                      config.protoSourceDirectory,
                      config.sourceDirectory,
                      config.testSourceDirectory,
                      config.generatedSourceDirectory,
                      config.integrationTestSourceDirectory,
                      config.indexFile
                    )
                case TypeScript =>
                  TypeScriptGenerator
                    .generate(
                      protobufDescriptor.toPath,
                      model,
                      config.protoSourceDirectory,
                      config.sourceDirectory,
                      config.testSourceDirectory,
                      config.generatedSourceDirectory,
                      config.integrationTestSourceDirectory,
                      config.indexFile
                    )
              }
              generated.foreach { p =>
                println("Generated: " + absBaseDir.relativize(p.toAbsolutePath).toString)
              }

            case Left(DescriptorSet.CannotOpen(e)) =>
              System.err.println(
                "There was a problem opening the protobuf descriptor file:"
              )
              System.err.println(e.toString)
              sys.exit(1)
          }

        } else {
          println("Skipping generation because there is no protobuf descriptor found.")
        }
      case _ =>
        sys.exit(1)
    }
}
